var assert = require('assert');
describe('CI-Test', function() {
  it('should not pass', function() {
    assert.equal(-1, 1);
  });
});
