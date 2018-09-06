const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SplitByPathPlugin = require('webpack-split-by-path');

module.exports = {
  entry: [
    path.join(__dirname, 'app/main.cjsx'),
  ],
  output: {
    publicPath: '/',
    path: path.join(__dirname, '/dist'),
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.HEAD_COMMIT': JSON.stringify(process.env.HEAD_COMMIT),
    }),
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      stats: true,
      sourceMap: true
    }),
    new CopyWebpackPlugin([
      { from: 'public', to: '.' },
    ]),
    new HtmlWebpackPlugin({
      template: 'views/index.ejs',
      inject: 'body',
      filename: 'index.html',
    }),
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin({
      filename: '[name]-[contenthash].css',
      allChunks: true,
    }),
    new SplitByPathPlugin([
      {
        name: 'vendor',
        path: path.join(__dirname, 'node_modules'),
      },
    ]),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.cjsx', '.coffee', '.styl', '.css'],
    modules: ['.', 'node_modules'],
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
        loader: 'cjsx-loader'
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
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: {
          loader: 'css-loader'
        }
      }),
    }, {
      test: /\.styl$/,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader'
        }, {
          loader: 'stylus-loader'
        }]
      }),
    }, {
      test: /\.(jpg|png|gif|otf|eot|svg|ttf|woff\d?)$/,
      use: 'file-loader',
    }],
    // suppress warning about the fact that sugar-client is precompiled
    noParse: [/sugar-client/],
  },
  node: {
    fs: 'empty',
  },
};
