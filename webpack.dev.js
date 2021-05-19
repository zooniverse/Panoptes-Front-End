'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var DashboardPlugin = require('webpack-dashboard/plugin');
var NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

var config = {
  mode: 'development',
  devServer: {
    allowedHosts: [
      '.zooniverse.org'
    ],
    historyApiFallback: true,
    host: process.env.HOST || "localhost",
    https: true,
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
    new webpack.EnvironmentPlugin([
      'HEAD_COMMIT',
      'NODE_ENV',
      'PANOPTES_API_APPLICATION',
      'PANOPTES_API_HOST',
      'STAT_HOST',
      'SUGAR_HOST',
      'TALK_HOST'
    ]),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public', to: '.' }
      ]
    }),
    new HtmlWebpackPlugin({
      useBasePath: false,
      template: 'views/index.ejs',
      inject: 'body',
      filename: 'index.html'
    }),
    new DashboardPlugin({ port: 3736 }), // Change this here and in the package.json start script if needed.
    new NodePolyfillPlugin(),  // Required for Webpack 5, since it removes Node.js polyfills
  ],
  resolve: {
    extensions: ['*', '.js', '.jsx', '.json', '.cjsx', '.coffee', '.styl', '.css'],
    modules: ['.', 'node_modules'],
    fallback: {
      fs: false,
    }
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
  }
};

module.exports = config;
