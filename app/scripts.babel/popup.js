import Vue from 'vue';
import Strings from './strings.js';
import marked from 'marked';
import hljs from 'highlightjs';

const vm = new Vue({
  el: '#app',
  data: {
    paid: true,
    title: '',
    editor: Strings.markdownString(),
    cheatSheetString: Strings.cheatSheetExample(),
    enableLines: false,
    showHTML: false,
    showCheatSheet: false,
    license: null,
  },
  watch: {
    editor() {
      return this.paid ? this.save(this.editor) : this.editor;
    }
  },
  mounted() {
    this.loadData();
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
    compiledCheatSheet() {
      return marked(this.cheatSheetString, {
        langPrefix: 'hljs '
      });
    }
  },
  methods: {
    cheatSheet: function cheatSheet() {
      if (!this.paid) {
        alert('Your trial has ended. Upgrade for only $2.99.')
        return false;
      }
      this.showCheatSheet = this.showCheatSheet ? false : true;
    },
    exportHTML: function exportHTML() {
      if (!this.paid) {
        alert('Your trial has ended. Upgrade for only $2.99.')
        return false;
      }
      this.showCheatSheet = false;
      this.showHTML = this.showHTML ? false : true;
    },
    update: function update(e) {
      this.editor = e.target.value;
    },
    lineNumbers: function lineNumbers() {
      if (!this.paid) {
        alert('Your trial has ended. Upgrade for only $2.99.')
        return false;
      }
      const active = document.getElementById('editor').className.indexOf('tln-active'); // This checks if its already running.
      if (active != -1 && this.enableLines === true) { // Is active
        this.enableLines = false;
        localStorage.removeItem('lines');

        const element = document.getElementById('editor');
        element.classList.remove('tln-active');

        const elements = document.getElementsByClassName('tln-wrapper');
        while (elements.length > 0) {
          elements[0].parentNode.removeChild(elements[0]);
        }
      } else {
        this.enableLines = true;
        localStorage.setItem('lines', 'true');
        append_line_numbers('editor');
      }
    },

    updateLicense: function updateLicense(license) {
      if ((license.license == 'FULL') || (license.license == 'TRIAL')) {
        this.paid = true;
      } else {
        this.paid = false;
       
      }
      this.license = license.license;
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
    }
  }
});

chrome.storage.sync.get(['license'], vm.updateLicense.bind(this));