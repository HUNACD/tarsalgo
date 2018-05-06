import '../../../../@polymer/polymer/polymer.js';

export const OrganizationBehaviors = {

  properties: {
    community: {
      type: Object,
      notify: true
    }
  },

  _goToCommunity: function (e) {
    var communityUrl = '/community/' + this.community.id;
    window.appGlobals.activity('open', 'community', communityUrl);
    this.redirectTo(communityUrl);
  },

  communityLogoImagePath: function (community) {
    return this.getImageFormatUrl(community.CommunityLogoImages, 0);
  },

  communityHeaderImagePath: function (community) {
    return this.getImageFormatUrl(community.CommunityHeaderImages, 0);
  },

  communityName: function (community, showAll) {
    if (community.name) {
      return this.truncate(this.trim(community.name),  showAll ? 300 : 35, '...');
    } else {
      return community.short_name;
    }
  },

  communityDescription: function (community, showAll) {
    if (community.description) {
      return this.truncate(this.trim(community.description), showAll ? 300 : 120, '...');
    } else {
      return "";
    }
  }
};
