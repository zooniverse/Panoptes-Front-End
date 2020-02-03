import {
  expect
} from 'chai';
import {
  getFeedbackMessages
} from './open-feedback-modal';

const MULTI_TRUE_MULTI_FALSE = [
  [true, false],
  [true, false],
  [true, false],
  [false, false],
  [false, false]
];

const MULTI_TRUE_SINGLE_FALSE = [
  [true, false],
  [true, false],
  [true, false],
  [false, false]
];

const SINGLE_TRUE_MULTI_FALSE = [
  [true, false],
  [false, false],
  [false, false],
  [false, false]
];

const MULTI_TRUE_MULTI_FALSE_FP = [
  [true, true],
  [true, false],
  [true, false],
  [false, false],
  [false, true]
];

const MULTI_TRUE_SINGLE_FALSE_FP = [
  [true, true],
  [true, false],
  [true, false],
  [false, false]
];

const SINGLE_TRUE_MULTI_FALSE_FP = [
  [true, false],
  [false, false],
  [false, true],
  [false, true]
];

function generateMinimalRule(status, ruleID) {
  return {
    id: ruleID,
    failureEnabled: true,
    successEnabled: true,
    failureMessage: 'miss',
    successMessage: 'hit',
    success: status[0],
    falsePosMode: status[1],
  };
}

const MULTI_TRUE_MULTI_FALSE_RULES = MULTI_TRUE_MULTI_FALSE.map(generateMinimalRule);
const MULTI_TRUE_SINGLE_FALSE_RULES = MULTI_TRUE_SINGLE_FALSE.map(generateMinimalRule);
const SINGLE_TRUE_MULTI_FALSE_RULES = SINGLE_TRUE_MULTI_FALSE.map(generateMinimalRule);

const MULTI_TRUE_MULTI_FALSE_FP_RULES = MULTI_TRUE_MULTI_FALSE_FP.map(generateMinimalRule);
const MULTI_TRUE_SINGLE_FALSE_FP_RULES = MULTI_TRUE_SINGLE_FALSE_FP.map(generateMinimalRule);
const SINGLE_TRUE_MULTI_FALSE_FP_RULES = SINGLE_TRUE_MULTI_FALSE_FP.map(generateMinimalRule);

describe('helpers > open-feedback-modal > getFeedbackMessages', function() {
  it('should exist', function() {
    expect(getFeedbackMessages).to.be.a('function')
  })
  describe('when reducing a list of feedback messages to unique entries with counts', function() {
    it('The counts for both message classes should be > 1.',
      function() {
        const reduced = getFeedbackMessages(MULTI_TRUE_MULTI_FALSE_RULES)
        expect(reduced).to.deep.equal({correct: ['hit (3 matches)'], incorrect: ['miss (2 matches)']})
      })

    it('The counts for the success message class should be > 1. ' +
      'The count for the failure message class should be 1.',
      function() {
        const reduced = getFeedbackMessages(MULTI_TRUE_SINGLE_FALSE_RULES)
        expect(reduced).to.deep.equal({correct: ['hit (3 matches)'], incorrect: ['miss (1 match)']})
      })

    it('The counts for the failure message class should be > 1. ' +
      'The count for the success message class should be 1.',
      function() {
        const reduced = getFeedbackMessages(SINGLE_TRUE_MULTI_FALSE_RULES)
        expect(reduced).to.deep.equal({correct : ['hit (1 match)'], incorrect: ['miss (3 matches)']})
      })

    it('1. The counts for the success message class should be > 1. ' +
      'The count for the failure message class should be 1. ' +
      'The count for the false positive message class should be 1.',
      function() {
        const reduced = getFeedbackMessages(MULTI_TRUE_MULTI_FALSE_FP_RULES)
        expect(reduced).to.deep.equal({correct: ['hit (2 matches)'], incorrect: ['miss (1 match)'], falsepos: ['hit (1 match)']})
      })

    it('2. The counts for the success message class should be > 1. ' +
      'The count for the failure message class should be 1. ' +
      'The count for the false positive message class should be 1.',
      function() {
        const reduced = getFeedbackMessages(MULTI_TRUE_SINGLE_FALSE_FP_RULES)
        expect(reduced).to.deep.equal({correct: ['hit (2 matches)'], incorrect: ['miss (1 match)'], falsepos: ['hit (1 match)']})
      })

    it('3. The counts for the success message class should be 1. ' +
      'The count for the failure message class should be 1. ' +
      'The count for the false positive message class should be 0.',
      function() {
        const reduced = getFeedbackMessages(SINGLE_TRUE_MULTI_FALSE_FP_RULES)
        expect(reduced).to.deep.equal({correct: ['hit (1 match)'], incorrect: ['miss (1 match)']})
      })
  })
})
