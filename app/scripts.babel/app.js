(function () {
  'use strict';
  //the rest of the function
}());


var markdownString =
  '# Markdown Editor \n \n' +
  ' Markdown is a lightweight markup language with plain text formatting syntax.  \n \n' +
  '#### Features \n \n' +
  '- Tables \n' +
  '- Fenced code blocks \n' +
  '- Even More \n\n' +
  '```javascript \n\n' +
  'function javascriptIsWild(){ \n \n' +
  'parseInt("Infinity", 10) // -> NaN \n\n' +
  '}\n' +
  '```' +
  '\n\n ### Support my work? \n\n 1. [My Donate Page](https://www.robertgabriel.ninja/donate) \n\n 2. [Patreon](https://www.patreon.com/robertjgabriel) ' +
  '\n\n ### Premium Version \n\n 1. Auto save your work!! \n\n 2. Only 1.99 cent \n\n 3. Download your work to the desktop';


var vm = new Vue({
  el: '#app',
  data: {
    paid: true,
    input: markdownString,
    license: null,
    title: '',
    enableLines: false
  },
  watch: {
    input: function () {
      /* function to detect if localstorage is supported */
      if (this.paid) {
        return this.saveData(this.input);
      } else {
        return this.input;
      }
    }
  },

  mounted: function () {
    this.loadData();

    var code = this.input;
    marked.setOptions({
      highlight: function (code) {
        return hljs.highlightAuto(code).value;
      }
    });
    hljs.initHighlighting();
  },
  computed: {
    compiledMarkdown: function () {
      return marked(this.input, {
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: true,
        smartLists: true,
        langPrefix: 'hljsjavascript hljs',
        xhtml: true
      });
    }
  },
  methods: {
    update: _.debounce(function (e) {
      this.input = e.target.value;
    }, 200),
    lineNumbers: function lineNumbers() {

      var active = document.getElementById('comment').className.indexOf('tln-active'); // This checks if its already running.

      if (active != -1 && this.enableLines === true) { // Is active
        this.enableLines = false;
        localStorage.removeItem('lines');

        var element = document.getElementById('comment');
        element.classList.remove('tln-active');

        var elements = document.getElementsByClassName('tln-wrapper');
        while (elements.length > 0) {
          elements[0].parentNode.removeChild(elements[0]);
        }

      } else {

        this.enableLines = true;
        localStorage.setItem('lines', 'true');
        append_line_numbers('comment');

      }
    },

    updateLicense: function updateLicense(license) {
      if ((license.license == 'FULL') || (license.license == 'TRIAL')) {
        this.paid = true;
        this.title = 'Markdown Editor';
      } else {
        this.paid = false;
        this.title = 'Your Trial has ended. Please upgrade <a href="https://chrome.google.com/webstore/detail/markdown-editor-chrome-gi/dkpldbigkfcgpamifjimiejipmodkigk" target="_blank">Here</a>';
      }

      this.license = license.license;
    },
    saveData: function saveData(input) {
      if (typeof Storage !== 'undefined') {
        return localStorage.setItem('storedData', input);
      }
    },
    print: function print() {
      var printIframe = document.getElementById('printArea');
      printIframe.contentWindow.document.body.innerHTML = document.getElementById('previewer').innerHTML;
      printIframe.contentWindow.focus(); // focus on contentWindow is needed on some ie versions
      printIframe.contentWindow.print();
      return false;
    },
    loadData: function loadData() {
      // Check if local storage is enabled
      if (localStorage.getItem('storedData') !== null) {
        // Load the data if needed
        this.input = localStorage.getItem('storedData');
      }

      if (localStorage.getItem('lines') !== null) {
        this.enableLines = true;
        this.lineNumbers();
      }

    },
    changeHandler: function () {
      return marked(this.input);
    },
    saveLocally: function () {
      //  Escape HTML
      var link = document.createElement('a');
      link.download = 'README.md';
      link.href = 'data:text/plain,' + this.input;
      link.click(); // trigger click/download
    }
  }
});

chrome.storage.sync.get(['license'], vm.updateLicense.bind(this));