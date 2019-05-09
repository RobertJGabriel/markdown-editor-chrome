const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
process.traceDeprecation = true;


module.exports = {
  context: __dirname + '/app/',
  entry: {
    'background.js': './scripts.babel/background.js', // remove unused
    'chromereload.js': './scripts.babel/chromereload.js',
    'popup.js': './scripts.babel/popup.js',
    'bundle.min.css': [
      '../node_modules/vue-material/dist/vue-material.min.css',
      '../node_modules/vue-material/dist/theme/default-dark.css',
      '../node_modules/highlightjs/styles/github.css',
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
    new ExtractTextPlugin("bundle.min.css")
  ]
};