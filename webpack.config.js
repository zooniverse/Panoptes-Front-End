'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'eval-source-map',
  entry: [
    'webpack-hot-middleware/client?reload=true',
    path.join(__dirname, 'app/simple.js')
  ],
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: '[name].js',
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'views/webpack.html',
      inject: 'body',
      filename: 'index.html'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],
  resolve: {
    extensions: ['', '.js', '.jsx', '.cjsx', '.coffee', '.styl', '.css', '.scss', '.sass'],
    modulesDirectories: ['.', 'node_modules']
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel'
    }, {
      test: /\.cjsx$/,
      exclude: /node_modules/,
      loaders: ['coffee', 'cjsx']
    }, {
      test: /\.coffee$/,
      loader: 'coffee'
    }, {
      test: /\.json?$/,
      loader: 'json'
    }, {
      test   : /\.css$/,
      loaders: ['style', 'css']
    }, {
      test: /\.styl$/,
      loaders: ['style','css','stylus']
    }, {
      test: /\.(jpg|png|gif|otf|eot|svg|ttf|woff\d?)$/,
      loader: 'file-loader'
    }]
  }
};
