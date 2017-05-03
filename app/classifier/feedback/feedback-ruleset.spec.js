// "Passing arrow functions (“lambdas”) to Mocha is discouraged" - https://mochajs.org/#arrow-functions
/* eslint prefer-arrow-callback: 0, func-names: 0 */
/* global describe, it, beforeEach, before */

import assert from 'assert';
import FeedbackRuleSet from './feedback-ruleset';

const SUBJECT = {
  metadata: {
    '#feedback_1_type': 'foo'
  }
};

const TASK = {
  feedback: {
    types: [
      {
        id: 'foo',
        valid: false,
      }
    ],
    enabled: true
  }
};


describe('FeedbackRuleSet class', function () {
  it('should always return an array', function () {
    const ruleset = new FeedbackRuleSet(SUBJECT, TASK);
    assert(ruleset.rules.length === 0);
  });

  it('should only return a rule if it\'s flagged valid', function () {
    const invalidRuleset = new FeedbackRuleSet(SUBJECT, TASK);
    assert(invalidRuleset.rules.length === 0);

    const validTask = Object.assign({}, TASK);
    validTask.feedback.types[0].valid = true;
    const validRuleset = new FeedbackRuleSet(SUBJECT, validTask);
    assert(validRuleset.rules.length === 1);
  });

  it('should use a subject success message if present');
  it('should use a subject failure message if present');
  it('should use the default success message if there\'s no subject success message');
  it('should use the default failure message if there\'s no subject failure message');
});
