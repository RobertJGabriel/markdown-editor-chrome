const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const glob = require('glob');


module.exports = {
  context: __dirname + '/app/',
  entry: {
    'background.js': './scripts.babel/background.js', // remove unused
    'chromereload.js': './scripts.babel/chromereload.js',
    'popup.js': './scripts.babel/popup.js',
    'content.js': './scripts.babel/content.js',
    'bundle.min.css': [
      '../node_modules/vue-material/dist/vue-material.min.css',
      '../node_modules/vue-material/dist/theme/default.css',
      './styles/app/main.css',
    ]
  },
  output: {
    path: path.resolve(__dirname, '/dist/help'),
    filename: '[name]'
  },
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.esm.js'
    }
  },
  module: {
    rules: [{
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      }, {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("bundle.min.css")
  ]

};