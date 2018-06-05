'use strict';

var paid = true;
Vue.config.productionTip = false;

var markdownString = '### What is Markdown? \n \n' + ' Markdown is a lightweight markup language with plain text formatting syntax.  \n \n' + '#### Features \n \n' + '- Tables \n' + '- Fenced code blocks \n' + '- Even More \n\n' + '```javascript \n\n' + 'function javascriptIsWild(){ \n \n' + 'parseInt("Infinity", 10) // -> NaN \n\n' + '}\n' + '```';

if (!paid) {
  markdownString += '\n\n ### Premium Version \n\n 1. Auto save your work!! \n\n 2. Only 99 cent \n\n 3. Download your work to the desktop';
}

//If this is the paid version load 
if (paid) {
  getData();
}

// Get all saved data
function getData() {
  // Check if local storage is enabled
  if (localStorage.getItem('storedData') !== null) {
    // Load the data if needed
    markdownString = localStorage.getItem('storedData');
  }
}

// Save data to local storage
function saveData(input) {
  if (typeof Storage !== 'undefined') {
    return localStorage.setItem('storedData', input);
  }
}

new Vue({
  el: '#app',
  data: {
    paid: paid,
    input: markdownString
  },
  watch: {
    input: function input() {
      /* function to detect if localstorage is supported*/
      if (paid) {
        return saveData(this.input);
      } else {
        return this.input;
      }
    }
  },

  mounted: function mounted() {
    var code = this.input;
    marked.setOptions({
      highlight: function highlight(code) {
        return hljs.highlightAuto(code).value;
      }
    });
    hljs.initHighlighting();
  },
  computed: {
    compiledMarkdown: function compiledMarkdown() {
      return marked(this.input, {
        langPrefix: 'hljs ',
        xhtml: true
      });
    }
  },
  methods: {
    update: _.debounce(function (e) {
      this.input = e.target.value;
    }, 200),
    changeHandler: function changeHandler() {
      return marked(this.input);
    },
    saveLocally: function saveLocally() {
      //  Escape HTML
      var link = document.createElement('a');
      link.download = 'README.md';
      link.href = 'data:text/plain,' + this.input;

      link.click(); // trigger click/download
    }
  }
});