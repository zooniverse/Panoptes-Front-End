'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var config = {
  devtool: 'eval-source-map',
  entry: [
    path.join(__dirname, 'app/main.cjsx')
  ],
  output: {
    publicPath: '/',
    path: path.join(__dirname, '/dist'),
    filename: '[name].js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.HEAD_COMMIT': JSON.stringify(process.env.HEAD_COMMIT)
    }),
    new CopyWebpackPlugin([
      { from: 'public', to: '.' }
    ]),
    new HtmlWebpackPlugin({
      useBasePath: false,
      template: 'views/index.ejs',
      inject: 'body',
      filename: 'index.html'
    })
  ],
  resolve: {
    extensions: ['', '.js', '.jsx', '.cjsx', '.coffee', '.styl', '.css'],
    modulesDirectories: ['.', 'node_modules']
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel'
    }, {
      // explicitly include markdownz (and dependencies) to be transformed because it's es6
      test: /\.jsx?$/,
      include: /markdown/,
      loader: 'babel?cacheDirectory'
    }, {
      test: /\.cjsx$/,
      exclude: /node_modules/,
      loaders: ['babel?cacheDirectory', 'coffee', 'cjsx']
    }, {
      test: /\.coffee$/,
      loaders: ['babel?cacheDirectory', 'coffee']
    }, {
      test: /\.json?$/,
      loader: 'json'
    }, {
      test   : /\.css$/,
      loaders: ['style', 'css?root=../public']
    }, {
      test: /\.styl$/,
      loaders: ['style','css?root=../public','stylus']
    }, {
      test: /\.(jpg|png|gif|otf|eot|svg|ttf|woff\d?)$/,
      loader: 'file-loader'
    }],
    // suppress warning about the fact that sugar-client is precompiled
    noParse: [/sugar-client/]
  } ,
  node: {
    fs: "empty"
  }
};

if (process.env.BABEL_ENV === 'hot-reload') {
  config.entry.unshift('webpack-hot-middleware/client?reload=true');
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
}

module.exports = config;
