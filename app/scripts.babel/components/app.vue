<template>
  <div class="page-container">
    <md-app md-waterfall md-mode="overlap">
      <md-app-toolbar class="md-primary md-large">
        <div class="md-toolbar-row">
          <span class="md-title">Markdown Editor</span>
          <div class="md-toolbar-section-end">
            <md-button class="md-icon-button" title='Save read me locally' v-on:click="saveLocally">
              <md-icon>save</md-icon>
            </md-button>
            <md-button class="md-icon-button" title='Print Markdown Editor' v-on:click="print">
              <md-icon>print</md-icon>
            </md-button>
            <md-button class="md-icon-button" title='Export to  HTML' target="blank" v-on:click="exportHTML">
              <md-icon>code</md-icon>
            </md-button>
            <md-button class="md-icon-button" title='Annoucment' target="blank" v-on:click="announcement">
              <md-icon>announcement</md-icon>
            </md-button>

          </div>
        </div>
      </md-app-toolbar>



      <md-app-content>
        <div class="md-layout">
          <div class="md-layout-item">
            <md-field>
              <md-textarea v-model="editor"  style="height:-webkit-fill-available" v-on:keyup="changeHandler()" ></md-textarea>

            </md-field>

          </div>
          <div class="md-layout-item  md-scrollbar preview" v-html="compiledMarkdown" >

          </div>
        </div>
      </md-app-content>
      <md-snackbar :md-duration="duration" :md-active.sync="showSnackbar" v-html='popupMessage' md-persistent>
      </md-snackbar>
    </md-app>

    <iframe id="printArea" class="hide"></iframe>
  </div>
</template>

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
</style>


<script>
  import Vue from 'vue';
  import Strings from '../strings.js';
  import marked from 'marked';
  import hljs from 'highlightjs';
  import 'highlightjs/styles/github.css';

  import i18n from 'vue-plugin-webextension-i18n';
  Vue.use(i18n);
  module.exports = {
    data: function () {
      return {
        paid: true,
        title: '',
        editor: Strings.markdownString(),
        cheatSheetString: Strings.cheatSheetExample(),
        enableLines: false,
        showHTML: false,
        showCheatSheet: false,
        license: null,
        duration: 3000,
        showSnackbar: false,
        popupMessage: '',
        trialOver: `<span><a href="https://chrome.google.com/webstore/detail/opendyslexic-font-helperb/ahmapmilbkfamljbpgphfndeemhnajme"
                    target="_blank">FKSK</a></span>`
      }
    },
    watch: {
      editor() {
        return this.paid ? this.save(this.editor) : this.editor;
      }
    },

    mounted: function () {

      this.loadData();

      //  chrome.storage.sync.get(['license'], this.updateLicense.bind(this));

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
          alert('Your trial has ended. Upgrade for only $2.99.')
          return false;
        }
        this.showHTML = this.showHTML ? false : true;
      },
      announcement: function announcement() {
this.showSnackbar = true;
      },
      save: function save(input) {
        if (!this.paid) {
          alert('Your trial has ended. Upgrade for only $2.99.')
          return false;
        }
        if (typeof Storage !== 'undefined') {
          return localStorage.setItem('storedData', input);
        }
      },

      print: function print() {
        if (!this.paid) {
          alert('Your trial has ended. Upgrade for only $2.99.')
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
          alert('Your trial has ended. Upgrade for only $2.99.')
          return false;
        }
        // Check if local storage is enabled
        if (localStorage.getItem('storedData') !== null) {
          // Load the data if needed
          this.editor = localStorage.getItem('storedData');
        }

        if (localStorage.getItem('lines') !== null) {
          this.enableLines = true;
          this.lineNumbers();
        }

      },
      changeHandler() {
        console.log(marked(this.editor));
        return marked(this.editor);
      },
      saveLocally() {
        if (!this.paid) {
          alert('Your trial has ended. Upgrade for only $2.99.')
          return false;
        }
        //  Escape HTML
        const link = document.createElement('a');
        link.download = 'README.md';
        link.href = `data:text/plain,${this.editor}`;
        link.click(); // trigger click/download
      },
      updateLicense: function (license) {
        console.log(license);
        this.paid = ((license.license == 'FULL') || (license.license == 'TRIAL')) ? true : false;
        this.docs = ((license.license == 'FULL') || (license.license == 'TRIAL')) ? true : false;


        return this.paid;
      }
    }
  }
</script>