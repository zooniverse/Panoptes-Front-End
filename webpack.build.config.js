var webpackConfig = require('./webpack.config');
delete webpackConfig.module.noParse;
delete webpackConfig.devtool;

webpackConfig.output.path = __dirname + '/' + process.env.BUILD_DIR;
webpackConfig.optimize = {
  occurenceOrder: true,
  minimize: true
};

module.exports = webpackConfig;
