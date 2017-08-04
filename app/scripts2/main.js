import Vue from 'vue'



Vue.config.productionTip = false;


new Vue({
  el: '#app',
  data: {
    input:
        '\n \n ### About \n \n' +
        'View, Edited and create markdown files. \n \n' +
        '### Install \n' +
        '1. Handy for github readmes \n' +
        '2. Also remember to review \n \n' +
        '### Code Highlighting \n' +
        '```javascript \n' +
        'function example(){ \n' +
        '  return x; \n'+
        '} \n' +
        '``` \n' +
        '### Learn more \n' +
        '[Markdown Cheat sheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)' 
  },
    mounted: function() {
        console.log('j');
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

// put this in the main file before you create the main instance / router.
Vue.directive('highlightjs', function() {
  hljs.highlightBlock(this.el)
});