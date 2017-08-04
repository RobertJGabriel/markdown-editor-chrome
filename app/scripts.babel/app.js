'use strict';


Vue.config.productionTip = false;

var markdownString =
  '### Version 0.3.2 \n \n' +
  '#### Notes \n \n' +
  '1. Support for code highlighting \n \n' +
  '#### Example \n \n' +

  '```javascript \n\n' +
  'function javascriptIsWild(){ \n \n' +
  '   parseInt("Infinity", 10) // -> NaN \n\n' +
  '   parseInt("Infinity", 18) // -> NaN... \n\n' +
  '   parseInt("Infinity", 19) // -> 18 \n\n' +
  '   parseInt("Infinity", 23) // -> 18... \n\n' +
  '}\n' +
  '```';

;

new Vue({
  el: '#app',
  data: {
    input: markdownString
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