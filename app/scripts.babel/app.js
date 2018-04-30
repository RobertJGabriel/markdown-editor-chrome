'use strict';

const paid = false;
Vue.config.productionTip = false;


var getSEOReportURL = 'https://seo-bot-.herokuapp.com/results';

function sleep(time) {
  var d1 = new Date().getTime();
  var d2 = new Date().getTime();
  while (d2 < d1 + time) {
    d2 = new Date().getTime();
  }
  return;
}



new Vue({
  el: '#app',
  data: {
    features: [],
    css: [],
    loading:null,
    other: [],
    input: 'https://www.robertgabriel.ninja'
  },
  watch: {
    input: function () {
      /* function to detect if localstorage is supported*/
      return this.input;
    }
  },

  mounted: function () {


  },
  computed: {
    compiledMarkdown: function () {

    }
  },
  methods: {
    update: _.debounce(function (e) {
      this.input = e.target.value;
    }, 200),
    changeHandler: function () {
      return this.input;
    },
    getSEOReport: function() {
      this.loading = true;
      this.$http.get(getSEOReportURL + '?name=' + encodeURI(this.input)).then(response => {

        console.log(response);
        this.features = JSON.parse(response.bodyText).features; // Parse the coffee lists
        this.css = this.features.css; // Parse the coffee lists
        this.loading = false;
      }, response => {
      });
  }
  }
});