// "Passing arrow functions (“lambdas”) to Mocha is discouraged" - https://mochajs.org/#arrow-functions
/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always'] */
/* global describe, it */

import assert from 'assert';
import processDrawingFeedback from './process-feedback-drawing';

const SUCCESS_MESSAGE = 'great success';
const FAILURE_MESSAGE = 'epic fail';
const QUESTION = 'Where is it?';
const RULE = {
  successMessage: SUCCESS_MESSAGE,
  failureMessage: FAILURE_MESSAGE,
  x: 10,
  y: 10,
  tol: 10,
  type: 'foo'
};

processDrawingFeedback.__Rewire__('FeedbackRuleSet', class FeedbackRuleSet {
  constructor() {
    this.rules = [RULE];
  }
});

const ANNOTATION = {
  task: 'T0',
  value: [
    { x: 10, y: 10 },
    { x: 10, y: 50 }
  ]
};

const SUBJECT = {
  metadata: { '#feedback_1_type': 'foo' }
};

const TASK = {
  question: QUESTION
};

describe('processDrawingFeedback', function () {
  it('should return an array of results', function () {
    const result = processDrawingFeedback(ANNOTATION, SUBJECT, TASK);
    assert(result.length === 1);
  });

  it('should return a success result if at least one annotation value is within rule tolerance', function () {
    const result = processDrawingFeedback(ANNOTATION, SUBJECT, TASK);
    assert(result[0].task === ANNOTATION.task);
    assert(result[0].success === true);
    assert(result[0].message === SUCCESS_MESSAGE);
    assert(result[0].x === 10);
    assert(result[0].y === 10);
    assert(result[0].tol === 10);
    assert(result[0].target === 'classifier');
  });

  it('should return a failure result if all annotation values are outside rule tolerance', function () {
    const failureAnnotation = Object.assign({}, ANNOTATION, { value: ANNOTATION.value.slice(0, 1) });
    const result = processDrawingFeedback(failureAnnotation, SUBJECT, TASK);
    assert(result[0].task === ANNOTATION.task);
    assert(result[0].success === false);
    assert(result[0].message === FAILURE_MESSAGE);
    assert(result[0].x === 10);
    assert(result[0].y === 10);
    assert(result[0].tol === 10);
    assert(result[0].target === 'classifier');
  });
});
