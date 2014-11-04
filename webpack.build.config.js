var webpackConfig = require('./webpack.config');
webpackConfig.output.path = __dirname + '/build';
module.exports = webpackConfig;
