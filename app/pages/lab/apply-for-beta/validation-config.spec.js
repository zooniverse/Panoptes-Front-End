/* eslint
  prefer-arrow-callback: 0,
  func-names: 0,
  'react/jsx-boolean-value': ['error', 'always']
*/
/* global describe, it, beforeEach */

import assert from 'assert';
import _ from 'lodash';
import config from './validation-config';

describe('Validation config:', function () {
  describe('minimum subject count', function () {
    const { minimumSubjectCount } = config;

    it('should exist', function () {
      const isUndefined = _.isUndefined(minimumSubjectCount);
      assert.strictEqual(isUndefined, false, 'minimumSubjectCount is undefined');
    });

    it('should be an integer', function () {
      const isAnInteger = _.isInteger(minimumSubjectCount);
      assert.strictEqual(isAnInteger, true, 'minimumSubjectCount is not an integer');
    });
  });

  describe('required pages', function () {
    const { requiredPages } = config;

    it('should exist', function () {
      const isUndefined = _.isUndefined(requiredPages);
      assert.strictEqual(isUndefined, false, 'requiredPages is undefined');
    });

    it('should be an array of strings', function () {
      const isArray = _.isArray(requiredPages);
      assert.strictEqual(isArray, true, 'requiredPages is not an array');
      const arrayOfStrings = requiredPages.every(_.isString);
      assert.strictEqual(arrayOfStrings, true, 'requiredPages contains a non-string value');
    });
  });
});
