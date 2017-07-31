'use strict';

function sleep(time) {

  let d1 = new Date().getTime();
  let d2 = new Date().getTime();
  while (d2 < d1 + time) {
    d2 = new Date().getTime();
  }
}

new Vue({
  el: '#app',
  data: {
    input:
`
# Markdown Live 

### About
View, Edited and create markdown files.

### Install
1. Handy for github readmes
2. Also remember to review

### Learn more
[Markdown Cheat sheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)
`
  },
  beforeCompile: function beforeCompile() {
    sleep(3000);
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