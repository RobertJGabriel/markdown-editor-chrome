'use strict';


Vue.config.productionTip = false;

var markdownString =
  '### What is Markdown? \n \n' +
  ' Markdown is a lightweight markup language with plain text formatting syntax.  \n \n' +
  '#### Extras \n \n' +
  '- Fenced code blocks \n' +
  '- Now auto saves your work!!! \n' +
  '- Tables \n' +
  '- Even More \n\n' +
  '```javascript \n\n' +
  'function javascriptIsWild(){ \n \n' +
  '   parseInt("Infinity", 10) // -> NaN \n\n' +
  '}\n' +
  '```';

if (localStorage.getItem('storedData') !== null) {
  markdownString = localStorage.getItem('storedData');
}



new Vue({
  el: '#app',
  data: {
    input: markdownString
  },
  watch: {
    input: function () {
      /* function to detect if localstorage is supported*/
      if (typeof Storage !== 'undefined') {
        localStorage.setItem('storedData', this.input)
      }
    }
  },

  mounted: function () {
    marked.setOptions({
      gfm: true,
      tables: true,
      breaks: true,
      pedantic: true,
      sanitize: true,
      smartLists: true,
      smartypants: true
    });
    hljs.initHighlighting();
  },
  computed: {
    compiledMarkdown: function () {
      return marked(this.input, {
        sanitize: true,
        langPrefix: 'hljs '
      });
    }
  },
  methods: {
    update: _.debounce(function (e) {
      this.input = e.target.value;
    }, 100),
    changeHandler: function () {
      hljs.initHighlighting.called = false;
      hljs.initHighlighting();
    }
  }
});