const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const glob = require('glob');
module.exports = {
  context: __dirname + '/app/',
  entry: {
    'background.js': './scripts.babel/background.js', // remove unused
    'chromereload.js': './scripts.babel/chromereload.js',
    'vendor.js': [
      './scripts.babel/vendor/fontawesome.js',
      './scripts.babel/vendor/tln.js',
    ],
    'tln.min.js': './scripts.babel/vendor/tln.js',
    'popup.js': './scripts.babel/popup.js',
    'bundle.min.css': [
      './styles/vendor/bootstrap.min.css',
      './styles/vendor/github.min.css',
      './styles/vendor/material.min.css',
      './styles/vendor/tln.min.css',
      './styles/app/main.css',
    ],
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
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("bundle.min.css"),
    new PurifyCSSPlugin({
      purifyOptions: {
        whitelist: ['*tln-*', '*hljs-*','*hljs*', '*editor-*'],
  
      },
      // Give paths to parse for rules. These should be absolute!
      paths: glob.sync(path.join(__dirname, 'app/*.html')),
    })
  ]

};