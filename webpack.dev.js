'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var DashboardPlugin = require('webpack-dashboard/plugin');

var config = {
  mode: 'development',
  devServer: {
    allowedHosts: [
      '.zooniverse.org'
    ],
    historyApiFallback: true,
    host: process.env.HOST || "localhost",
    overlay: true,
    port: 3735
  },
  devtool: 'cheap-module-source-map',
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
    }),
    new DashboardPlugin({ port: 3736 }) // Change this here and in the package.json start script if needed.
  ],
  resolve: {
    extensions: ['*', '.js', '.jsx', '.json', '.cjsx', '.coffee', '.styl', '.css'],
    modules: ['.', 'node_modules']
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: 'babel-loader'
    }, {
      test: /\.cjsx$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
        options: { cacheDirectory: true }
      }, {
        loader: 'coffee-loader'
      }, {
        loader: 'cjsx-loader'
      }]
    }, {
      test: /\.coffee$/,
      use: [{
        loader: 'babel-loader',
        options: { cacheDirectory: true }
      }, {
        loader: 'coffee-loader'
      }]
    }, {
      test: /\.css$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader'
      }]
    }, {
      test: /\.styl$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader'
      }, {
        loader: 'stylus-loader'
      }]
    }, {
      test: /\.(jpg|png|gif|otf|eot|svg|ttf|woff\d?)$/,
      use: 'file-loader'
    }],
    // suppress warning about the fact that sugar-client is precompiled
    noParse: [/sugar-client/]
  },
  node: {
    fs: "empty"
  }
};

module.exports = config;
