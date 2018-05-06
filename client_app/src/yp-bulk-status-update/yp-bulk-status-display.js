import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../@polymer/iron-image/iron-image.js';
import '../yp-app-globals/yp-app-icons.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { ypThemeBehavior } from '../yp-theme/yp-theme-behavior.js';
import { ypOfficialStatusOptions } from '../yp-behaviors/yp-official-status-options.js';
import { ypImageFormatsBehavior } from '../yp-behaviors/yp-image-formats-behavior.js';
import { ypTruncateBehavior } from '../yp-behaviors/yp-truncate-behavior.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
      :host {
        padding: 16px;
        margin: 16px;
      }

      .statusMaterial {
        background-color: #FFF;
        padding: 16px;
        margin: 32px;
        margin-top: 16px;
      }

      a {
        color: #000;
      }

      .detail {
        max-width: 400px;
        margin: 8px;
        padding: 8px;
      }

      .openCloseButton {
        cursor: pointer;
        margin-top: 8px;
      }

      .ideaLink {
        cursor: pointer;
        text-decoration: underline;
      }

      .postName {
        margin-top: 8px;
      }

      .mainHeader {
        margin: 16px;
        margin-bottom: 0;
      }

      .infoText {
        padding-top: 8px;
        padding-right: 8px;
        padding-left: 8px;
      }

      .voteText {
        font-size: 19px;
      }

      .topArea {
        background-color: var(--primary-background-color);
        background-image: var(--top-area-background-image, none);
        height: 300px;
        padding-top: 0;
        margin-top: -24px;
      }

      .headerMaterial {
        padding: 16px;
        background-color: #fcfcfc;
        padding-top: 8px;
        padding-bottom: 24px;
      }


      @media (max-width: 900px) {
        .topArea {
          height: auto;
        }

        .statusMaterial {
          background-color: #FFF;
          padding: 16px;
          margin: 16px;
          margin-top: 8px;
        }

      }

      [hidden] {
        display: none !important;
      }
    </style>

    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <div class="layout vertical center-center topArea">
      <paper-material elevation="5" class="headerMaterial layout vertical center-center">
        <h2 class="mainHeader">[[t('bulkStatusUdateFor')]]: [[community.name]]</h2>
        <div class="infoText">[[t('bulkStatusUdateForInfo')]]</div>
      </paper-material>
    </div>

    <template is="dom-repeat" items="[[config.groups]]" as="group">
      <paper-material elevation="2" class="statusMaterial layout horizontal center-center wrap">
        <template is="dom-repeat" items="[[_orderGroupStatuses(group.statuses)]]" as="status">
          <div class="layout vertical self-start">
            <h1 hidden\$="[[hideGroupName]]">[[group.name]]</h1>
            <h2>[[_officialStatusOptionsNamePlural(status.official_status)]]</h2>
            <template is="dom-repeat" items="[[status.posts]]" as="post">
              <div class="layout vertical">
                <div class="layout horizontal">
                  <iron-icon class="openCloseButton" data-args\$="[[post.id]]" icon="keyboard-arrow-right" on-tap="_setOpen"></iron-icon>
                  <div class="postName">
                    <div class="ideaLink" data-args\$="[[post.id]]" on-tap="_setOpen">[[post.name]]</div>
                  </div>
                </div>
                <div id="detail_[[post.id]]" class="detail" hidden="">
                  <div class="reason" hidden\$="[[post.uniqueStatusMessage]]">
                    [[_getTemplate(post.selectedTemplateName)]]
                  </div>
                  <div class="reason" hidden\$="[[!post.uniqueStatusMessage]]">
                    [[post.uniqueStatusMessage]]
                  </div>
                  <div class="postName">
                    [[t('urlLink')]]: <a target="_blank" href="/post/[[post.id]]">[[post.name]]</a>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </template>
      </paper-material>
    </template>

    <yp-ajax id="ajax" url="/api/users/[[userId]]/status_update/[[statusUpdateId]]" on-response="_response"></yp-ajax>
`,

  is: 'yp-bulk-status-display',

  behaviors: [
    ypLanguageBehavior,
    ypOfficialStatusOptions,
    ypThemeBehavior,
    ypImageFormatsBehavior,
    ypTruncateBehavior
  ],

  properties: {

    config: {
      type: Object
    },

    templates: {
      type: Object
    },

    community: {
      type: Object,
      observer: '_communityChanged'
    },

    statusUpdateId: {
      type: Number,
      observer: '_statusUpdateIdChanged'
    },

    readToLoad: {
      type: Boolean,
      computed: '_readyToLoad(userId, statusUpdateId)'
    },

    userId: Number,

    hideGroupName: {
      type: Boolean,
      value: false
    }
  },

  _communityChanged: function (community) {
    if (community && community.CommunityHeaderImages && community.CommunityHeaderImages.length>0) {
      this.setupTopHeaderImage(community.CommunityHeaderImages);
    }

    if (community) {
      if (community.id==470) {
        this.set('hideGroupName', true);
      }
    }
  },

  setupTopHeaderImage: function (image) {
    var path;
    if (image) {
      path = 'url(' + this.getImageFormatUrl(image, 0) + ')';
    } else {
      path = 'none';
    }
    this.updateStyles({ '--top-area-background-image': path });
  },

  _orderGroupStatuses: function (statuses) {
    var order = {
      "-1": 3,
      "0": 2,
      "-2": 1,
      "2": 0
    };

    return statuses.sort(function (a, b) {
      return order[a.official_status.toString()]-order[b.official_status.toString()];
    });
  },

  _getTemplate: function (templateName) {
    if (templateName && this.templates[templateName]) {
      return this.templates[templateName].content.replace("www.kosning.reykjavik.is", "kosning.reykjavik.is");
    } else {
      return "Vantar upplýsingar";
    }
  },

  _readyToLoad: function (userId, statusUpdateId) {
    if (userId && statusUpdateId) {
      this.async(function () {
        this.$.ajax.generateRequest();
      }, 20);
    }
  },

  _statusUpdateIdChanged: function (id) {
  },

  _setOpen: function (event, detail) {
    event = event || window.event;
    event = event.target || event.srcElement;
    var postId = event.getAttribute('data-args');
    this.$$("#detail_"+postId).hidden = !this.$$("#detail_"+postId).hidden;
  },

  _setClosed: function () {
    var postId = event.target.getAttribute('data-args');
    this.$$("#detail_"+postId).hidden = true;
  },

  _response: function (event, detail) {
    this.set('config', detail.response.config);
    var templates = {};
    detail.response.templates.forEach(function (template) {
      templates[template.title] = template;
    });
    this.set('templates', templates);
    this.set('community', detail.response.community);
    this.fire("change-header", { headerTitle: this.truncate(this.community.name,80),
      documentTitle: this.t('bulkStatusUdateFor')+' '+this.truncate(this.community.name,80),
      headerDescription: '',//this.truncate(this.post.Group.objectives,45),
      backPath: "/community/" + this.community.id });
    if (this.community.theme_id!=null) {
      this.setTheme(this.community.theme_id);
    }


  }
});
