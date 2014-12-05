var webpackConfig = require('./webpack.config');
webpackConfig.entry.main = '../test/runner.coffee';
webpackConfig.output.path = __dirname + '/tmp';
webpackConfig.output.filename = 'test.js';
module.exports = webpackConfig;
