/* eslint
  func-names: 0,
  import/no-extraneous-dependencies: ['error', { 'devDependencies': true }]
  max-len: 0,
  no-underscore-dangle: 0,
  prefer-arrow-callback: 0,
  'react/jsx-boolean-value': ['error', 'always']
*/

import assert from 'assert';
import processDrawingFeedback from './process-feedback-drawing';
import {
  mockFeedbackRule,
  SUCCESS_MESSAGE,
  FAILURE_MESSAGE,
  SUBJECT,
  TASK
} from './process-feedback-fixtures';

const NORMAL_SHOW_RULE = {
  successEnabled: true,
  successMessage: SUCCESS_MESSAGE,
  failureEnabled: true,
  failureMessage: FAILURE_MESSAGE,
  x: 10,
  y: 10,
  tol: 10,
  type: 'foo',
  dud: false
};

const NORMAL_NOSHOW_RULE = Object.assign({}, NORMAL_SHOW_RULE, {
  successEnabled: false,
  failureEnabled: false
});

const DUD_SHOW_RULE = Object.assign({}, NORMAL_SHOW_RULE, {
  dud: true
});

const DUD_NOSHOW_RULE = Object.assign({}, NORMAL_NOSHOW_RULE, {
  dud: true
});

const NORMAL_ANNOTATION = {
  task: 'T0',
  value: [
    { x: 10, y: 10 },
    { x: 10, y: 50 }
  ]
};

const FAILURE_ANNOTATION = Object.assign({}, NORMAL_ANNOTATION, {
  value: [
    { x: 10, y: 50 }
  ]
});

const DUD_ANNOTATION = Object.assign({}, NORMAL_ANNOTATION, { value: [] });

const mockDrawingFeedbackRule = rule => mockFeedbackRule(processDrawingFeedback, rule);

describe('processDrawingFeedback', function () {
  it('should return an array of results', function () {
    mockDrawingFeedbackRule(NORMAL_SHOW_RULE);
    const result = processDrawingFeedback(NORMAL_ANNOTATION, SUBJECT, TASK);
    assert(result.length === 1);
  });

  it('should return a success result if at least one annotation value is within rule tolerance, and showing a success message is enabled', function () {
    mockDrawingFeedbackRule(NORMAL_SHOW_RULE);

    const result = processDrawingFeedback(NORMAL_ANNOTATION, SUBJECT, TASK);
    assert.strictEqual(result[0].task, NORMAL_ANNOTATION.task);
    assert.strictEqual(result[0].success, true);
    assert.strictEqual(result[0].message, SUCCESS_MESSAGE);
    assert.strictEqual(result[0].x, 10);
    assert.strictEqual(result[0].y, 10);
    assert.strictEqual(result[0].tol, 10);
    assert.strictEqual(result[0].target, 'classifier');
  });

  it('should return nothing if at least one annotation value is within rule tolerance, but showing a success message is disabled', function () {
    mockDrawingFeedbackRule(NORMAL_NOSHOW_RULE);

    const result = processDrawingFeedback(NORMAL_ANNOTATION, SUBJECT, TASK);
    assert.strictEqual(result.length, 0);
  });

  it('should return a failure result if all annotation values are outside rule tolerance, and showing a failure message is enabled', function () {
    mockDrawingFeedbackRule(NORMAL_SHOW_RULE);

    const result = processDrawingFeedback(FAILURE_ANNOTATION, SUBJECT, TASK);
    assert.strictEqual(result[0].task, NORMAL_ANNOTATION.task);
    assert.strictEqual(result[0].success, false);
    assert.strictEqual(result[0].message, FAILURE_MESSAGE);
    assert.strictEqual(result[0].x, 10);
    assert.strictEqual(result[0].y, 10);
    assert.strictEqual(result[0].tol, 10);
    assert.strictEqual(result[0].target, 'classifier');
  });

  it('should return nothing if all annotation values are outside rule tolerance, but showing a failure message is disabled', function () {
    mockDrawingFeedbackRule(NORMAL_NOSHOW_RULE);

    const result = processDrawingFeedback(FAILURE_ANNOTATION, SUBJECT, TASK);
    assert.strictEqual(result.length, 0);
  });

  it('should return a success result if the subject is a dud and there are no annotations, and showing a success message is enabled', function () {
    mockDrawingFeedbackRule(DUD_SHOW_RULE);

    const result = processDrawingFeedback(DUD_ANNOTATION, SUBJECT, TASK);
    assert.strictEqual(result[0].task, DUD_ANNOTATION.task);
    assert.strictEqual(result[0].success, true);
    assert.strictEqual(result[0].message, SUCCESS_MESSAGE);
    assert.strictEqual(result[0].target, 'summary');
  });

  it('should return nothing if the subject is a dud and there are no annotations, but showing a success message is disabled', function () {
    mockDrawingFeedbackRule(DUD_NOSHOW_RULE);
    const result = processDrawingFeedback(DUD_ANNOTATION, SUBJECT, TASK);
    assert.strictEqual(result.length, 0);
  });


  it('should return a failure result if the subject is a dud and there are annotations, and showing a failure message is enabled', function () {
    mockDrawingFeedbackRule(DUD_SHOW_RULE);

    const result = processDrawingFeedback(NORMAL_ANNOTATION, SUBJECT, TASK);
    assert.strictEqual(result[0].task, NORMAL_ANNOTATION.task);
    assert.strictEqual(result[0].success, false);
    assert.strictEqual(result[0].message, FAILURE_MESSAGE);
    assert.strictEqual(result[0].target, 'summary');
  });

  it('should return nothing if the subject is a dud and there are annotations, but showing a failure message is disabled', function () {
    mockDrawingFeedbackRule(DUD_NOSHOW_RULE);

    const result = processDrawingFeedback(NORMAL_ANNOTATION, SUBJECT, TASK);
    assert.strictEqual(result.length, 0);
  });
});
