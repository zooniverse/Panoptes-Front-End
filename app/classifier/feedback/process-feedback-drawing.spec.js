// "Passing arrow functions (“lambdas”) to Mocha is discouraged" - https://mochajs.org/#arrow-functions
/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always'] */
/* global describe, it */

import assert from 'assert';
import processDrawingFeedback from './process-feedback-drawing';

const SUCCESS_MESSAGE = 'great success';
const FAILURE_MESSAGE = 'epic fail';
const QUESTION = 'Where is it?';
const BASE_RULE = {
  successMessage: SUCCESS_MESSAGE,
  failureMessage: FAILURE_MESSAGE,
  x: 10,
  y: 10,
  type: 'foo',
  dud: false
};

const NORMAL_RULE = Object.assign({}, BASE_RULE, { tol: 10 });
const DUD_RULE = Object.assign({}, BASE_RULE, { dud: true });

const BASE_ANNOTATION = { task: 'T0' };

const NORMAL_ANNOTATION = Object.assign({}, BASE_ANNOTATION, {
  value: [
    { x: 10, y: 10 },
    { x: 10, y: 50 }
  ]
});

const DUD_ANNOTATION = Object.assign({}, BASE_ANNOTATION, { value: [] });

const SUBJECT = {
  metadata: { '#feedback_1_type': 'foo' }
};

const TASK = {
  question: QUESTION
};

const mockFeedbackRule = (rule) => {
  processDrawingFeedback.__Rewire__('FeedbackRuleSet', class FeedbackRuleSet {
    constructor() {
      this.rules = [rule];
    }
  });
};

describe('processDrawingFeedback', function () {

  it('should return an array of results', function () {
    mockFeedbackRule(NORMAL_RULE);
    const result = processDrawingFeedback(NORMAL_ANNOTATION, SUBJECT, TASK);
    assert(result.length === 1);
  });

  it('should return a success result if at least one annotation value is within rule tolerance', function () {
    mockFeedbackRule(NORMAL_RULE);

    const [result] = processDrawingFeedback(NORMAL_ANNOTATION, SUBJECT, TASK);
    assert.strictEqual(result.task, NORMAL_ANNOTATION.task);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.message, SUCCESS_MESSAGE);
    assert.strictEqual(result.x, 10);
    assert.strictEqual(result.y, 10);
    assert.strictEqual(result.tol, 10);
    assert.strictEqual(result.target, 'classifier');
  });

  it('should return a failure result if all annotation values are outside rule tolerance', function () {
    mockFeedbackRule(NORMAL_RULE);

    const failureAnnotation = Object.assign({}, NORMAL_ANNOTATION, { value: NORMAL_ANNOTATION.value.slice(1, 1) });
    const [result] = processDrawingFeedback(failureAnnotation, SUBJECT, TASK);
    assert.strictEqual(result.task, NORMAL_ANNOTATION.task);
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.message, FAILURE_MESSAGE);
    assert.strictEqual(result.x, 10);
    assert.strictEqual(result.y, 10);
    assert.strictEqual(result.tol, 10);
    assert.strictEqual(result.target, 'classifier');
  });

  it('should return a success result if the subject is a dud and there are no annotations', function () {
    mockFeedbackRule(DUD_RULE);

    const [result] = processDrawingFeedback(DUD_ANNOTATION, SUBJECT, TASK);
    assert.strictEqual(result.task, DUD_ANNOTATION.task);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.message, SUCCESS_MESSAGE);
    assert.strictEqual(result.target, 'summary');

  });

  it('should return a failure result if the subject is a dud and there are annotations', function () {
    mockFeedbackRule(DUD_RULE);

    const [result] = processDrawingFeedback(NORMAL_ANNOTATION, SUBJECT, TASK);
    assert.strictEqual(result.task, NORMAL_ANNOTATION.task);
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.message, FAILURE_MESSAGE);
    assert.strictEqual(result.target, 'summary');
  });
});
