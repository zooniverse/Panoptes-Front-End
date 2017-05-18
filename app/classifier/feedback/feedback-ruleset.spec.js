// "Passing arrow functions (“lambdas”) to Mocha is discouraged" - https://mochajs.org/#arrow-functions
/* eslint prefer-arrow-callback: 0, func-names: 0 */
/* global describe, it, beforeEach, before */

import assert from 'assert';
import FeedbackRuleSet from './feedback-ruleset';

const SUBJECT = {
  metadata: {
    '#feedback_1_type': 'foo',
    '#feedback_1_ping': 'pong',
    '#feedback_1_fizz': 'buzz',
    '#feedback_2_see': 'saw'
  }
};

const TASK = {
  feedback: {
    types: [
      { id: 'foo', valid: false }
    ],
    enabled: true
  }
};

const successMessage = 'great success';
const failureMessage = 'epic fail';

describe('FeedbackRuleSet class', function () {
  it('should always return an array', function () {
    const ruleset = new FeedbackRuleSet(SUBJECT, TASK);
    assert.strictEqual(ruleset.rules.length, 0);
  });

  it('should only return a rule if it\'s flagged valid', function () {
    const invalidRuleset = new FeedbackRuleSet(SUBJECT, TASK);
    assert.strictEqual(invalidRuleset.rules.length, 0);

    const validTask = Object.assign({}, TASK);
    validTask.feedback.types[0].valid = true;
    const validRuleset = new FeedbackRuleSet(SUBJECT, validTask);
    assert.strictEqual(validRuleset.rules.length, 1);
  });

  it('should use a subject success message if present instead of the task one', function () {
    const subjectWithSuccess = Object.assign({}, SUBJECT);
    const taskWithSuccess = Object.assign({}, TASK);
    subjectWithSuccess.metadata['#feedback_1_successMessage'] = successMessage;
    taskWithSuccess.feedback.types[0].defaultSuccessMessage = 'foobar';
    const ruleset = new FeedbackRuleSet(subjectWithSuccess, taskWithSuccess);
    assert.strictEqual(ruleset.rules[0].successMessage, successMessage);
  });

  it('should use a subject failure message if present instead of the task one', function () {
    const subjectWithFailure = Object.assign({}, SUBJECT);
    const taskWithFailure = Object.assign({}, TASK);
    subjectWithFailure.metadata['#feedback_1_failureMessage'] = failureMessage;
    taskWithFailure.feedback.types[0].defaultFailureMessage = 'foobar';
    const ruleset = new FeedbackRuleSet(subjectWithFailure, taskWithFailure);
    assert.strictEqual(ruleset.rules[0].failureMessage, failureMessage);
  });

  it('should use the default success message if there\'s no subject success message', function () {
    const taskWithSuccess = Object.assign({}, TASK);
    taskWithSuccess.feedback.types[0].defaultSuccessMessage = successMessage;
    const ruleset = new FeedbackRuleSet(SUBJECT, taskWithSuccess);
    assert.strictEqual(ruleset.rules[0].successMessage, successMessage);
  });

  it('should use the default failure message if there\'s no subject failure message', function () {
    const taskWithFailure = Object.assign({}, TASK);
    taskWithFailure.feedback.types[0].defaultFailureMessage = failureMessage;
    const ruleset = new FeedbackRuleSet(SUBJECT, taskWithFailure);
    assert.strictEqual(ruleset.rules[0].failureMessage, failureMessage);
  });

  it('should copy over any other feedback fields set in the subject to the returned rule', function () {
    const validTask = Object.assign({}, TASK);
    validTask.feedback.types[0].valid = true;
    const ruleset = new FeedbackRuleSet(SUBJECT, validTask);
    assert.strictEqual(ruleset.rules[0].ping, 'pong');
    assert.strictEqual(ruleset.rules[0].fizz, 'buzz');
    assert.strictEqual(ruleset.rules[0].see, undefined);
  });
});
