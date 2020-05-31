const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')


module.exports = {
  mode: 'development',
  context: __dirname + '/app/',
  entry: {
    'background.js': './scripts.babel/background.js', // remove unused
    'chromereload.js': './scripts.babel/chromereload.js',
    'popup.js': './scripts.babel/popup.js',
    'core/license.js': './scripts.babel/core/license.js',
    'core/save.js': './scripts.babel/core/save.js', // remove unused
    'core/settings.js': './scripts.babel/core/settings.js', // remove unused
  },
  output: {
    path: path.resolve(__dirname, '/dist/help'),
    filename: '[name]'
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['.ts', '.js', '.vue', '.json']

  },
  module: {
    rules: [{
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {},
          esModule: true // example of setting to false
        }
      }, {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            useRelativePath: false,
            name: '[name].[ext]',
            publicPath: 'fonts/icons/',
            outputPath: 'fonts/'
          }
        }]
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("bundle.min.css"),
    new VueLoaderPlugin(),
  ]
};