// "Passing arrow functions (“lambdas”) to Mocha is discouraged" - https://mochajs.org/#arrow-functions
/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always'] */
/* global describe, it */

import assert from 'assert';
import processSingleFeedback from './process-feedback-single';
import { 
  mockFeedbackRule,
  SUCCESS_MESSAGE,
  FAILURE_MESSAGE,
  TASK,
  QUESTION,
  SUBJECT,
} from './process-feedback-fixtures';

const SHOW_RULE = {
  answerIndex: '1',
  successEnabled: true,
  successMessage: SUCCESS_MESSAGE,
  failureEnabled: true,
  failureMessage: FAILURE_MESSAGE,
  type: 'foo'
};

const NOSHOW_RULE = Object.assign({}, SHOW_RULE, {
  successEnabled: false,
  failureEnabled: false,
});

const ANNOTATION = { task: 'T0', value: 1 };

const mockSingleFeedbackRule = (rule) => mockFeedbackRule(processSingleFeedback, rule);

describe('processSingleFeedback', function () {
  it('should return an array of results', function () {
    mockSingleFeedbackRule(SHOW_RULE);
    const result = processSingleFeedback(ANNOTATION, SUBJECT, TASK);
    assert.strictEqual(result.length, 1);
  });

  it('should return a success result if a rule and annotation match, and showing a success message is enabled', function () {
    mockSingleFeedbackRule(SHOW_RULE);
    const result = processSingleFeedback(ANNOTATION, SUBJECT, TASK);
    assert.strictEqual(result[0].success, true);
    assert.strictEqual(result[0].message, SUCCESS_MESSAGE);
    assert.strictEqual(result[0].question, QUESTION);
    assert.strictEqual(result[0].target, 'summary');
  });

  it('should return nothing if a rule and annotation match, but showing a success message is disabled', function () {
    mockSingleFeedbackRule(NOSHOW_RULE);
    const result = processSingleFeedback(ANNOTATION, SUBJECT, TASK);
    assert.strictEqual(result.length, 0);
  });

  it('should return a failure result if a rule and annotation don\'t match, and showing a failure message is enabled', function () {
    mockSingleFeedbackRule(SHOW_RULE);
    const failureAnnotation = Object.assign({}, ANNOTATION, { value: 2 });
    const result = processSingleFeedback(failureAnnotation, SUBJECT, TASK);
    assert.strictEqual(result[0].success, false);
    assert.strictEqual(result[0].message, FAILURE_MESSAGE);
    assert.strictEqual(result[0].question, QUESTION);
    assert.strictEqual(result[0].target, 'summary');
  });

  it('should return nothing if a rule and annotation don\'t match, but showing a failure message is disabled', function () {
    mockSingleFeedbackRule(NOSHOW_RULE);
    const result = processSingleFeedback(ANNOTATION, SUBJECT, TASK);
    assert.strictEqual(result.length, 0);
  });
});
