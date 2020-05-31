<template>
  <div class="page-container">
    <md-app>
      <!--- Markdown Toolbar --->
      <md-app-toolbar>
        <div class="md-toolbar-row">
          <span class="md-title">Markdown Editor</span>
          <div class="md-toolbar-section-end">
            <md-button class="md-primary md-dense md-raised upgrade_button" target="_blank"
              href="https://www.coffeeandfun.com/markdown#pricing" v-show="settings.paid === false && settings.sign_in === true">
              {{ $i18n("button_upgrade") }}
            </md-button>

            <md-button class="md-primary md-dense md-raised upgrade_button" target="_blank"
              href="https://www.coffeeandfun.com/#signin"
              v-show="settings.paid === false && settings.sign_in === false">
              {{ $i18n("sign_in_message") }}
            </md-button>
            <md-button class="md-icon-button" title='Save readme.' v-on:click="saveLocally">
              <md-icon>save</md-icon>
            </md-button>
            <md-button class="md-icon-button" title='Print markdown.' v-on:click="print">
              <md-icon>print</md-icon>
            </md-button>
            <md-button class="md-icon-button" title='Export to HTML' target="blank" v-on:click="exportHTML">
              <md-icon>code</md-icon>
            </md-button>
            <md-button class="md-icon-button" title='Help' target="blank" v-on:click="syncLicense">
              <md-icon>sync</md-icon>
            </md-button>
            <md-button class="md-icon-button" title='Help' target="blank" v-on:click="help">
              <md-icon>help_outline</md-icon>
            </md-button>
          </div>
        </div>
      </md-app-toolbar>
      <!--- Content --->
      <md-app-content>
        <div class="md-layout">


          <div class="md-layout-item md-xsmall-hide md-small-hide">
            <md-field>
              <md-textarea v-model="editor" v-on:keyup="changeHandler()">
              </md-textarea>
            </md-field>
          </div>



          <div class="md-layout-item  preview" id="preview" v-if="!showHTML" v-html="compiledMarkdown">
          </div>




          <div class="md-layout-item  preview" v-if="showHTML">
            {{ compiledMarkdown }}
          </div>


        </div>
        <md-snackbar :md-duration="alert.duration" :md-active.sync="alert.show" v-html='alert.message' md-persistent>
        </md-snackbar>
      </md-app-content>
    </md-app>
    <iframe id="printArea" class="hide"></iframe>
  </div>
</template>

<script>
  import Vue from 'vue';
  import Strings from './core/strings.js';


  import i18n from 'vue-plugin-webextension-i18n';

  import "material-icons/iconfont/material-icons.css";
  import marked from 'marked';
  import hljs from 'highlightjs';

  import 'highlightjs/styles/solarized-dark.css';

  Vue.use(i18n);
  module.exports = {
    data: function () {

      return {

        title: '',
        editor: Strings.markdownString(),
        showHTML: false,

        trialOver: `<span><a href="https://www.coffeeandfun.com/#markdown"
                    target="_blank">Upgrade for only $12.00</a></span>`,
        alert: {
          duration: 5000,
          show: false,
          message: ""
        },
        messagesFound: '',
        settings: {
          paid: null,
          license: null,
          message: "",
          sign_in: true,
          daysLeft: 7
        },
      };
    },
    created: function () {
      this.syncLicense();
      const SETTING_KEYS = ["license", "message"];
      chrome.storage.sync.get(SETTING_KEYS, settings => {
        this.settings.license = !!settings.license;
        return;
      });

    },

    computed: {
      compiledMarkdown() {
        return marked(this.editor, {
          langPrefix: 'hljs '
        });
      }
    },
    watch: {
      editor() {
        return this.settings.paid ? this.save(this.editor) : this.editor;
      }
    },
    mounted: function () {

      const code = this.editor;
      marked.setOptions({
        highlight(code) {
          return hljs.highlightAuto(code).value;
        }
      });
      hljs.initHighlighting();
      this.load();

    },
    methods: {



      exportHTML: function exportHTML() {
        if (this.settings.paid === false) {

          this.snackbar(null);

          return false;
        }

        this.showHTML = this.showHTML ? false : true;
      },
      help: function help() {
        window.location.href = 'https://www.coffeeandfun.com/#support';
      },
      save: function save(input) {
        if (this.paid === false) {

          this.snackbar(null);

          return false;
        }
        if (typeof Storage !== 'undefined') {
          this.snackbar('Saved');
          return localStorage.setItem('storedData', input);
        }
      },
      print: function print() {
        if (this.settings.paid === false) {

          this.snackbar(null);

          return false;
        }
        this.showHTML = false;
        const printIframe = document.getElementById('printArea');
        printIframe.contentWindow.document.body.innerHTML = document.getElementById('preview').innerHTML;
        printIframe.contentWindow.focus(); // focus on contentWindow is needed on some ie versions
        printIframe.contentWindow.print();
        return false;
      },



      syncLicense() {
        this.alert.message = this.$i18n("options_sync");
        this.alert.show = true;
        chrome.extension.sendMessage({
            app: "syncLicense"
          },
          response => {

            this.updateLicense(response);
          }
        );
      },


      updateLicense: function (response) {

        switch (response.message.toLowerCase()) {
          case "active":
            this.settings.paid = true;
            this.alert.message = this.$i18n("title_message_full");
            this.settings.message = this.$i18n("title_message_full");
            console.log(this.$i18n("title_message_full"));
            break;
          case "incomplete_expired":
            this.settings.paid = false;
            this.alert.message = this.$i18n("incomplete_expired");
            this.settings.message = this.$i18n("incomplete_expired");
            console.log(this.$i18n("incomplete_expired"));
            break;
          case "sign_in":
            this.settings.paid = false;
            this.settings.sign_in = false;
            this.alert.message = this.$i18n("sign_in");
            this.settings.message = this.$i18n("sign_in");
            break;
          case "past_due":
            this.settings.paid = true;
            this.alert.message = this.$i18n("past_due");
            this.settings.message = this.$i18n("past_due");
            console.log(this.$i18n("past_due"));
            break;
          case "incomplete":
            this.settings.paid = false;
            this.alert.message = this.$i18n("incomplete");
            this.settings.message = this.$i18n("incomplete");
            console.log(this.$i18n("incomplete"));
            break;
          case "unpaid":
            this.settings.paid = false;
            this.alert.message = this.$i18n("unpaid");
            this.settings.message = this.$i18n("unpaid");
            console.log(this.$i18n("unpaid"));
            break;
          case "canceled":
            this.settings.paid = false;
            this.alert.message = this.$i18n("canceled");
            this.settings.message = this.$i18n("canceled");
            console.log(this.$i18n("canceled"));
            break;
          case "none":
            this.settings.paid = false;
            this.alert.message = this.$i18n("title_message_none");
            this.settings.message = this.$i18n("title_message_none");
            break;
          case "trialing":
            this.settings.paid = true;
            console.log(response.time);
            this.alert.message =
              this.$i18n("title_enjoy_until") +
              moment(response.time).format("LL");
            this.settings.message =
              this.$i18n("title_enjoy_until") +
              moment(response.time).format("LL");
            console.log(response.time);
            break;
          default:
            this.settings.paid = false;
            this.alert.message = this.$i18n("title_message_fallback");
            this.settings.message = this.$i18n("title_message_fallback");
            console.log(this.alert.message);
        }
        this.alert.show = false;
        return this.settings.paid;
      },

      changeHandler() {
        return marked(this.editor);
      },
      saveLocally() {
        if (this.settings.paid === false) {

          this.snackbar(null);

          return false;
        }
        this.snackbar('Downloading');
        //  Escape HTML
        const link = document.createElement('a');
        link.download = 'README.md';
        link.href = `data:text/plain,${this.editor}`;
        link.click(); // trigger click/download
      },

      load: function () {
        // Make the api request
        // Check if local storage is enabled
        if (localStorage.getItem('storedData') !== null) {
          // Load the data if needed
          this.snackbar('Loading...');
          this.editor = localStorage.getItem('storedData');
        }
      },

      save: function (token, type) {
        let setting = {};
        setting[token] = type;
        chrome.storage.sync.set(setting);
        return setting;
      },
      snackbar: function (message) {
        if (message === undefined || message === "" || message === null) {
          this.alert.show = true;
          this.alert.message = this.$i18n("money");
          return false;
        }
        this.alert.message = message;
        this.alert.show = true;
      }
    }
  };
</script>

<style scoped>
  .hide {
    display: none;
  }

  .md-field.md-has-textarea:not(.md-autogrow):after,
  .md-field.md-has-textarea:not(.md-autogrow):before {
    border: 0;
  }

  .md-app {
    display: flex !important;
    flex-direction: column !important;
    height: 100% !important;
  }

  .md-layout {
    display: flex !important;

    height: 100% !important;
  }

  .md-field,
  .md-field.md-has-textarea:not(.md-autogrow) .md-textarea {
    display: flex !important;
    height: 100% !important;
    max-height: 100% !important;
  }
</style>