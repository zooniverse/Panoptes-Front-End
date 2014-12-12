var webpackConfig = require('./webpack.config');
var webpack = require('webpack');

delete webpackConfig.module.noParse;
delete webpackConfig.devtool;

webpackConfig.optimize = {
  minimize: true,
  occurenceOrder: true,
  dedupe: true
};

// webpackConfig.plugins = [
//   new webpack.DefinePlugin({
//     'process.env': {NODE_ENV: 'production'}
//   })
// ];

module.exports = webpackConfig;
