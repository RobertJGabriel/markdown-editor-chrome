'use strict';

new Vue({
  el: '#app',
  data: {
    input:
        '# Markdown Live \n \n' +
        '### About \n \n' +
        'View, Edited and create markdown files. \n \n' +
        '### Install \n' +
        '1. Handy for github readmes \n' +
        '2. Also remember to review \n' +
        '### Code Highlighting \n \n' +
        '```javascript \n' +
        'function example(){ \n' +
        '  return x; \n'+
        '} \n' +
        '``` \n' +
        '### Learn more \n' +
        '[Markdown Cheat sheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)' 
  },
  computed: {
    compiledMarkdown: function () {
      return marked(this.input, {
        sanitize: true
      })
    }
  },
  methods: {
    update: _.debounce(function (e) {
      this.input = e.target.value;
    }, 300)
  }
});

Vue.config.productionTip = false;

hljs.initHighlightingOnLoad();