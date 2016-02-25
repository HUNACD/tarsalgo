"use strict";

// Currently using Sequelize and Postgresql for fastest possible implementataion.
// Those model classes could be relatively easily replaces by another database layers
// Ideally there should be a modular interface for the model layer. All activities are saved to
// elastic search through the logs. Based on https://www.w3.org/TR/activitystreams-core/

var async = require("async");
var log = require('../utils/logger');
var queue = require('../workers/queue');
var toJson = require('../utils/to_json');

var setupDefaultAssociations = function (activity, user, domain, community, group, done) {
  async.parallel([
    function(callback) {
      activity.setDomain(domain).then(function (results) {
        callback(results ? null : true);
      });
    },
    function(callback) {
      if (user) {
        activity.setUser(user).then(function (results) {
          callback(results ? null : true);
        });
      } else {
        callback();
      }
    },
    function(callback) {
      if (community) {
        activity.setCommunity(community).then(function (results) {
          callback(results ? null : true);
        });
      } else {
        callback();
      }
    },
    function(callback) {
      if (group) {
        activity.setGroup(group).then(function (results) {
          callback(results ? null : true);
        });
      } else {
        callback();
      }
    }
  ], function(error) {
    done(error)
  });
};

module.exports = function(sequelize, DataTypes) {
  var AcActivity = sequelize.define("AcActivity", {
    access: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    sub_type: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.STRING, allowNull: false },
    object: DataTypes.JSONB,
    actor: DataTypes.JSONB,
    target: DataTypes.JSONB,
    context: DataTypes.JSONB,
    user_interaction_profile: DataTypes.JSONB
  }, {
    indexes: [
      {
        name: 'activity_public_and_active_by_type',
        fields: ['type'],
        where: {
          access: 0,
          status: 'active'
        }
      },
      {
        name: 'activity_active_by_type',
        fields: ['type'],
        where: {
          status: 'active'
        }
      },
      {
        name: 'activity_public_and_active_by_domain_id',
        fields: ['domain_id'],
        where: {
          access: 0,
          status: 'active'
        }
      },
      {
        name: 'activity_active_by_domain_id',
        fields: ['domain_id'],
        where: {
          status: 'active'
        }
      },
      {
        name: 'activity_public_and_active_by_community_id',
        fields: ['community_id'],
        where: {
          access: 0,
          status: 'active'
        }
      },
      {
        name: 'activity_active_by_community_id',
        fields: ['community_id'],
        where: {
          status: 'active'
        }
      },
      {
        name: 'activity_public_and_active_by_group_id',
        fields: ['group_id'],
        where: {
          access: 0,
          status: 'active'
        }
      },
      {
        name: 'activity_active_by_group_id',
        fields: ['group_id'],
        where: {
          status: 'active'
        }
      },
      {
        name: 'activity_public_and_active_by_post_id',
        fields: ['post_id'],
        where: {
          access: 0,
          status: 'active'
        }
      },
      {
        name: 'activity_active_by_post_id',
        fields: ['post_id'],
        where: {
          status: 'active'
        }
      },
      {
        name: 'activity_active_by_type_and_user_id',
        fields: ['type','user_id'],
        where: {
          status: 'active'
        }
      },
      {
        name: 'activity_active_by_user_id',
        fields: ['user_id'],
        where: {
          status: 'active'
        }
      },
      {
        name: 'activity_all_by_type',
        fields: ['type']
      },
      {
        fields: ['object'],
        using: 'gin',
        operator: 'jsonb_path_ops'
      },
      {
        fields: ['actor'],
        using: 'gin',
        operator: 'jsonb_path_ops'
      },
      {
        fields: ['target'],
        using: 'gin',
        operator: 'jsonb_path_ops'
      },
      {
        fields: ['context'],
        using: 'gin',
        operator: 'jsonb_path_ops'
      },
      {
        fields: ['user_interaction_profile'],
        using: 'gin',
        operator: 'jsonb_path_ops'
      }
    ],

    underscored: true,

    tableName: 'ac_activities',

    classMethods: {

      ACCESS_PUBLIC: 0,
      ACCESS_COMMUNITY: 1,
      ACCESS_GROUP: 2,
      ACCESS_PRIVATE: 3,

      associate: function(models) {
        AcActivity.belongsTo(models.Domain);
        AcActivity.belongsTo(models.Community);
        AcActivity.belongsTo(models.Group);
        AcActivity.belongsTo(models.Post);
        AcActivity.belongsTo(models.Point);
        AcActivity.belongsTo(models.Invite);
        AcActivity.belongsTo(models.User);
        AcActivity.belongsToMany(models.User, { through: 'OtherUser' });
      },

      createActivity: function(type, subType, actor, object, context, userId, domainId, communityId, groupId, done) {

        if (!object)
          object = {};

        if (!context)
          context = {};

        if (!actor)
          actor = {};

        if (userId)
          actor['userId'] = userId;

        if (domainId)
          object['domainId'] = domainId;

        if (communityId)
          object['communityId'] = communityId;

        if (groupId)
          object['groupId'] = groupId;

        sequelize.models.AcActivity.build({
          type: type,
          status: 'active',
          sub_type: subType,
          actor: actor,
          object: object,
          context: context,
          user_id: userId,
          domain_id: domainId,
          community_id: communityId,
          group_id: groupId,
          access: sequelize.models.AcActivity.ACCESS_PRIVATE
        }).save().then(function(activity) {
          if (activity) {
                queue.create('process-activity', activity).priority('critical').removeOnComplete(true).save();
                log.info('Activity Created', { activity: toJson(activity), userId: userId});
                done();
          } else {
            done('Activity Not Found');
          }
        }).catch(function(error) {
          log.error('Activity Created Error', { err: error });
          done(error);
        });
      },

      createPasswordRecovery: function(user, domain, community, token, done) {

        sequelize.models.AcActivity.build({
          type: "activity.password.recovery",
          status: 'active',
          actor: { user: user },
          object: {
            domain: domain,
            community: community,
            token: token
          },
          access: sequelize.models.AcActivity.ACCESS_PRIVATE
        }).save().then(function(activity) {
          if (activity) {
            setupDefaultAssociations(activity, user, domain, community, null, function (error) {
              if (error) {
                log.error('Activity Creation Error', error);
                done('Activity Creation Error');
              } else {
                queue.create('process-activity', activity).priority('critical').removeOnComplete(true).save();
                log.info('Activity Created', { activity: toJson(activity), user: toJson(user) });
                done(null);
              }
            });
          } else {
            done('Activity Not Found');
          }
       }).catch(function(error) {
          log.error('Activity Created Error', { err: error });
          done(error);
        });
      }
    }
  });

  return AcActivity;
};
