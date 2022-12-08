var transform = require('coffee-react-transform');

module.exports = function(cjsx) {
  this.cacheable && this.cacheable();
  return transform(cjsx);
};
