import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../@polymer/iron-media-query/iron-media-query.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../google-map/google-map.js';
import '../../../../google-map/google-map-marker.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import '../yp-ajax/yp-ajax.js';
import './yp-post-card.js';
import './yp-post-map-info.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }

      .mapContainer {
        margin: 0;
        padding: 0;
        width: 960px;
        height: 500px;
        margin-top: 16px;
        margin-bottom: 48px;
      }

      .noMapContainer {
        padding: 32px;
        margin: 16px;
        background-color: #FFF;
        font-size: 22px;
        color: #222;
      }

      #map {
      }

      a {
        color: var(--primary-color-700);
      }

      h1 {
        padding: 24px;
      }

      @media (max-width: 934px) {
        .mapContainer {
          margin: 16px;
          width: 800px;
          height: 400px;
        }
      }

      @media (max-width: 832px) {
        .mapContainer {
          margin: 8px;
          width: 600px;
          height: 340px;
        }
      }

      @media (max-width: 632px) {
        .mapContainer {
          margin: 8px;
          width: 400px;
          height: 300px;
        }
      }

      @media (max-width: 420px) {
        .mapContainer {
          margin: 8px;
          width: 330px;
          height: 250px;
        }
      }

      @media (max-width: 360px) {
        .mapContainer {
          margin: 8px;
          width: 280px;
          height: 200px;
        }
      }

      #myInfoCard {
        background-color: #000;
        padding: 0;
        margin: 0 !important;
        --yp-post-map-info-mixin: {
          padding: 0;
          margin: 0 !important;
          max-width: 100%;
          max-height: 100%;
        };
        --yp-post-map-info-beak-mixin: {
          color: #F57C00;
        };
      }
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>
    <iron-media-query query="(min-width: 1000px)" query-matches="{{wide}}"></iron-media-query>

    <div class="layout vertical center-center">
      <template is="dom-if" if="[[posts]]">
        <paper-material id="mapContainer" elevation="2" class="mapContainer">
          <google-map additional-map-options="{&quot;keyboardShortcuts&quot;:false}" id="map" api-key="AIzaSyDkF_kak8BVZA5zfp5R4xRnrX8HP3hjiL0" fit-to-markers="">
            <template is="dom-repeat" items="[[posts]]" as="post">
              <google-map-marker slot="markers" latitude="[[post.location.latitude]]" longitude="[[post.location.longitude]]" click-events="" class="marker" on-google-map-marker-click="markerClick">
              </google-map-marker>
            </template>
            <yp-post-map-info id="myInfoCard" fade-in="">
              <yp-post-card mini="" post\$="[[selectedPost]]"></yp-post-card>
            </yp-post-map-info>
          </google-map>
        </paper-material>
      </template>

      <template is="dom-if" if="[[noPosts]]">
        <paper-material elevation="1" class="noMapContainer">
          <div>[[t('posts.noMapPosts')]]</div>
        </paper-material>
      </template>

      <div class="layout horizontal center-center">
        <yp-ajax id="ajax" on-response="_response"></yp-ajax>
      </div>
    </div>
`,

  is: 'yp-post-map',

  behaviors: [
    ypLanguageBehavior
  ],

  properties: {
    posts: {
      type: Array,
      value: null
    },

    groupId: {
      type: Number,
      observer: "_groupIdChanged"
    },

    communityId: {
      type: Number,
      observer: "_communityIdChanged"
    },

    noPosts: {
      type: Boolean,
      value: false
    },

    wide: Boolean,
    selectedPost: Object
  },

  resetMapHeight: function () {
    var map = this.$$("#mapContainer");
    if (map) {
      var windowHeight = window.innerHeight;
      if (map) {
        var height;
        if (this.wide) {
          height = windowHeight - 448;
          //map.style.height = Math.max(Math.min(height, window.innerHeight)),  + 'px';
          //map.style.width = Math.min(window.innerWidth, 1920) + 'px';
        }
      }
    }
 },

  _groupIdChanged: function (newValue, oldValue) {
    if (newValue) {
      this.set("posts", null);
      this.$.ajax.url = '/api/groups/'+newValue+'/post_locations';
      this.$.ajax.generateRequest();
    } else {
      this.set("posts", null);
    }
  },

  _communityIdChanged: function (newValue, oldValue) {
    if (newValue) {
      this.set("posts", null);
      this.$.ajax.url = '/api/communities/'+newValue+'/post_locations';
      this.$.ajax.generateRequest();
    } else {
      this.set("posts", null);
    }
  },

  _response: function (event, detail) {
    if (detail.response && detail.response.length>0) {
      this.set('noPosts', false);
      this.set('posts', detail.response);
    } else {
      this.set('noPosts', true);
    }
    this.resetMapHeight();
  },

  markerClick: function(e) {
    window.appGlobals.activity('clicked', 'marker');
    this.set('selectedPost', e.model.get('post'));
    var a = this.selectedPost;
    if (e.srcElement) {
      this.$$("#myInfoCard").showInfoWindow(e.srcElement.marker);
    } else {
      this.$$("#myInfoCard").showInfoWindow(e.currentTarget.marker);
    }
    var infocardDiv = this.$$("#myInfoCard").$$("#infocarddiv");
    infocardDiv.children[1].style.zIndex = "20";
  }
});
