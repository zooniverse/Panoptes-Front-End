var webpackConfig = require('./webpack.config');

delete webpackConfig.module.noParse;
delete webpackConfig.devtool;

webpackConfig.optimize = {
  minimize: true,
  occurenceOrder: true,
  dedupe: true
};

module.exports = webpackConfig;
