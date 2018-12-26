<template>
  <div class="page-container">
    <md-app>
      <md-app-toolbar class="md-primary">
        <div class="md-toolbar-row">
          <span class="md-title">Markdown Editor</span>
          <div class="md-toolbar-section-end">
            <md-button class="md-icon-button" title='Save readme.' v-on:click="saveLocally">
              <md-icon>save</md-icon>
            </md-button>
            <md-button class="md-icon-button" title='Print markdown.' v-on:click="print">
              <md-icon>print</md-icon>
            </md-button>
            <md-button class="md-icon-button" title='Export to HTML' target="blank" v-on:click="exportHTML">
              <md-icon>code</md-icon>
            </md-button>
            <md-button class="md-icon-button" title='Help' target="blank" v-on:click="help">
              <md-icon>help_outline</md-icon>
            </md-button>
          </div>
        </div>
      </md-app-toolbar>

      <md-app-content>
        <div class="md-layout">
          <div class="md-layout-item">
            <md-field>
              <md-textarea v-model="editor" style="height:-webkit-fill-available" v-on:keyup="changeHandler()"></md-textarea>
            </md-field>
          </div>
          <div class="md-layout-item  md-scrollbar preview" id="preview" v-if="!showHTML" v-html="compiledMarkdown">
          </div>
          <div class="md-layout-item  md-scrollbar preview" v-if="showHTML">
            {{ compiledMarkdown }}
          </div>
        </div>
        <md-snackbar :md-duration="duration" :md-active.sync="showSnackbar" v-html='popupMessage' md-persistent>
        </md-snackbar>
      </md-app-content>
    </md-app>
    <iframe id="printArea" class="hide"></iframe>
  </div>
</template>


<script>
  import Vue from 'vue';
  import Strings from '../strings.js';
  import marked from 'marked';
  import hljs from 'highlightjs';
  import 'highlightjs/styles/github.css';

  module.exports = {
    data: function () {
      return {
        paid: true,
        title: '',
        editor: Strings.markdownString(),
        showHTML: false,
        license: null,
        duration: 5000,
        showSnackbar: false,
        trialOver: `<span><a href="https://chrome.google.com/webstore/detail/markdown-editor-chrome-gi/dkpldbigkfcgpamifjimiejipmodkigk"
                    target="_blank">Your Trial is over. Upgrade for only 2.99</a></span>`
      }
    },
    watch: {
      editor() {
        return this.paid ? this.save(this.editor) : this.editor;
      }
    },

    mounted: function () {

      this.loadData();

      chrome.storage.sync.get(['license'], this.updateLicense.bind(this));

      const code = this.editor;
      marked.setOptions({
        highlight(code) {
          return hljs.highlightAuto(code).value;
        }
      });
      hljs.initHighlighting();
    },
    computed: {
      compiledMarkdown() {
        return marked(this.editor, {
          langPrefix: 'hljs '
        });
      },
    },
    methods: {
      exportHTML: function exportHTML() {
        if (!this.paid) {
          this.snackbarMessage(this.trialOver);
          return false;
        }
        this.showHTML = this.showHTML ? false : true;
      },
      help: function help() {
        window.location.href = 'https://www.robertgabriel.ninja/support';
      },
      save: function save(input) {
        if (!this.paid) {
          this.snackbarMessage(this.trialOver);
          return false;
        }
        if (typeof Storage !== 'undefined') {
          this.snackbarMessage('Saved');
          return localStorage.setItem('storedData', input);
        }
      },
      print: function print() {
        if (!this.paid) {
          this.snackbarMessage(this.trialOver);
          return false;
        }
        this.showHTML = false;
        const printIframe = document.getElementById('printArea');
        printIframe.contentWindow.document.body.innerHTML = document.getElementById('preview').innerHTML;
        printIframe.contentWindow.focus(); // focus on contentWindow is needed on some ie versions
        printIframe.contentWindow.print();
        return false;
      },

      loadData: function loadData() {
        if (!this.paid) {
          this.snackbarMessage(this.trialOver);
          return false;
        }
        // Check if local storage is enabled
        if (localStorage.getItem('storedData') !== null) {
          // Load the data if needed
          this.snackbarMessage('Loading...');
          this.editor = localStorage.getItem('storedData');
        }
      },
      changeHandler() {
        return marked(this.editor);
      },
      saveLocally() {
        if (!this.paid) {
          this.snackbarMessage(this.trialOver);
          return false;
        }

        this.snackbarMessage('Downloading');
        //  Escape HTML
        const link = document.createElement('a');
        link.download = 'README.md';
        link.href = `data:text/plain,${this.editor}`;
        link.click(); // trigger click/download
      },
      snackbarMessage: function (message) {
        this.popupMessage = message;
        this.showSnackbar = true;
        return false;
      },
      updateLicense: function (license) {
        this.paid = ((license.license == 'FULL') || (license.license == 'TRIAL')) ? true : false;
        this.docs = ((license.license == 'FULL') || (license.license == 'TRIAL')) ? true : false;
        return this.paid;
      }
    }
  }
</script>



<style scoped>
  .md-layout {
    height: -webkit-fill-available;
  }

  .md-field {
    border: 0px;
  }

  .md-layout-item:nth-child(2) {
    padding: 1.5rem;
  }


  .md-has-textarea {
    height: -webkit-fill-available;
  }

  .md-textarea {
    max-height: -webkit-fill-available;
  }

  .hide {
    display: none;
  }

  .md-field.md-has-textarea:not(.md-autogrow):after,
  .md-field.md-has-textarea:not(.md-autogrow):before {
    border: 0;
  }
</style>
