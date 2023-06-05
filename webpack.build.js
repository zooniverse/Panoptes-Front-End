const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: [
    path.join(__dirname, 'app/main.cjsx'),
  ],
  mode: 'production',
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'main',
          test: /\.(css|styl)$/,
          chunks: 'all',
          enforce: true
        },
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  output: {
    publicPath: '/',
    path: path.join(__dirname, '/dist'),
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].js',
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new webpack.EnvironmentPlugin({
      'HEAD_COMMIT': null,
      'NODE_ENV': 'production',
      'PANOPTES_API_APPLICATION': null,
      'PANOPTES_API_HOST': null,
      'STAT_HOST': null,
      'SUGAR_HOST': null,
      'TALK_HOST': null
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public', to: '.' },
      ]
    }),
    new HtmlWebpackPlugin({
      template: 'views/index.ejs',
      inject: 'body',
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash].css'
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.cjsx', '.coffee', '.styl', '.css'],
    modules: ['.', 'node_modules'],
    fallback: {
      fs: false,
      // for markdown-it plugins
      path: require.resolve("path-browserify"),
      util: require.resolve("util"),
      url: require.resolve("url"),
      process: false,
    }
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules\/(?!(markdown-it-anchor|markdown-it-table-of-contents|striptags)\/).*/,
      // markdown-it-anchor, markdown-it-table-of-contents and striptags are written in ES6.
      use: 'babel-loader',
    }, {
      test: /\.cjsx$/,
      exclude: /node_modules/,
      use: [{
        loader:'babel-loader'
      }, {
        loader: 'coffee-loader'
      }, {
        loader: path.resolve('./webpack/cjsx-loader.js')
      }],
    }, {
      test: /\.coffee$/,
      use: [{
        loader: 'babel-loader'
      }, {
        loader: 'coffee-loader'
      }],
    }, {
      test: /\.css$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader'
      ],
    }, {
      test: /\.styl$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'stylus-loader'
      ],
    }, {
      test: /\.(jpg|png|gif|otf|eot|svg|ttf|woff\d?)$/,
      type: 'asset/resource'
    }],
    // suppress warning about the fact that sugar-client is precompiled
    noParse: [/sugar-client/],
  }
};
