'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var deploySubdir = !!process.env.DEPLOY_SUBDIR ? '/'+process.env.DEPLOY_SUBDIR+'/': '';
var cssAdjust = '../public'

module.exports = {
  devtool: 'eval-source-map',
  entry: [
    path.join(__dirname, 'app/main.cjsx')
  ],
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: '[name].js',
    publicPath: deploySubdir
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      compress: {
        warnings: true
      }
    }),
    new CopyWebpackPlugin([
      { from: 'public', to: '.' }
    ]),
    new HtmlWebpackPlugin({
      baseUrl: deploySubdir,
      template: 'views/index.ejs',
      inject: 'body',
      filename: 'index.html'
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new ExtractTextPlugin("[name]-[contenthash].css", {
        devTool: 'source-map',
        allChunks: true
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
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader?root='+cssAdjust)
    }, {
      test: /\.styl$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader?root='+cssAdjust+'!stylus-loader')
    }, {
      test: /\.(jpg|png|gif|otf|eot|svg|ttf|woff\d?)$/,
      loader: 'file-loader'
    }],
    // suppress warning about the fact that sugar-client is precompiled
    noParse: [/sugar-client/]
  }
};
