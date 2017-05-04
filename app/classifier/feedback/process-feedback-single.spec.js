// "Passing arrow functions (“lambdas”) to Mocha is discouraged" - https://mochajs.org/#arrow-functions
/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always'] */
/* global describe, it */

import assert from 'assert';
import processSingleFeedback from './process-feedback-single';

const SUCCESS_MESSAGE = 'great success';
const FAILURE_MESSAGE = 'epic fail';
const QUESTION = 'What is it?';
const RULE = {
  answerIndex: '1',
  successMessage: SUCCESS_MESSAGE,
  failureMessage: FAILURE_MESSAGE,
  type: 'foo'
};

processSingleFeedback.__Rewire__('FeedbackRuleSet', class FeedbackRuleSet {
  constructor() {
    this.rules = [RULE];
  }
});

const ANNOTATION = { task: 'T0', value: 1 };

const SUBJECT = {
  metadata: { '#feedback_1_type': 'foo' }
};

const TASK = {
  question: QUESTION
};

describe('processSingleFeedback', function () {
  it('should return an array of results', function () {
    const result = processSingleFeedback(ANNOTATION, SUBJECT, TASK);
    assert(result.length === 1);
  });

  it('should return a success result if a rule and annotation match', function () {
    const result = processSingleFeedback(ANNOTATION, SUBJECT, TASK);
    assert(result[0].success === true);
    assert(result[0].message === SUCCESS_MESSAGE);
    assert(result[0].question === QUESTION);
    assert(result[0].target === 'summary');
  });

  it('should return a failure result if a rule and annotation don\'t match', function () {
    const failureAnnotation = Object.assign({}, ANNOTATION, { value: 2 });
    const result = processSingleFeedback(failureAnnotation, SUBJECT, TASK);
    assert(result[0].success === false);
    assert(result[0].message === FAILURE_MESSAGE);
    assert(result[0].question === QUESTION);
    assert(result[0].target === 'summary');
  });
});
