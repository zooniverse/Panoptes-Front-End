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
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      stats: true,
      compress: {
        warnings: false,
      },
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
    new ExtractTextPlugin('[name]-[contenthash].css', {
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
    extensions: ['', '.js', '.jsx', '.cjsx', '.coffee', '.styl', '.css'],
    modulesDirectories: ['.', 'node_modules'],
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
    }, {
      // explicitly include markdownz (and dependencies) to be transformed because it's es6
      test: /\.jsx?$/,
      include: /markdown/,
      loader: 'babel',
    }, {
      test: /\.cjsx$/,
      exclude: /node_modules/,
      loaders: ['babel', 'coffee', 'cjsx'],
    }, {
      test: /\.coffee$/,
      loaders: ['babel', 'coffee'],
    }, {
      test: /\.json?$/,
      loader: 'json',
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader?root=../public'),
    }, {
      test: /\.styl$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader?root=../public!stylus-loader'),
    }, {
      test: /\.(jpg|png|gif|otf|eot|svg|ttf|woff\d?)$/,
      loader: 'file-loader',
    }],
    // suppress warning about the fact that sugar-client is precompiled
    noParse: [/sugar-client/],
  },
  node: {
    fs: 'empty',
  },
};
