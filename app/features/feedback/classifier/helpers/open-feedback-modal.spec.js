import {
  expect
} from 'chai';
import {
  getFeedbackMessages
} from './open-feedback-modal';

const MULTI_TRUE_MULTI_FALSE = [
  true,
  true,
  true,
  false,
  false
];

const MULTI_TRUE_SINGLE_FALSE = [
  true,
  true,
  true,
  false
];

const SINGLE_TRUE_MULTI_FALSE = [
  true,
  false,
  false,
  false
];

function generateMinimalRule(status, ruleID) {
  return {
    id: ruleID,
    failureEnabled: true,
    successEnabled: true,
    failureMessage: 'miss',
    successMessage: 'hit',
    success: status
  };
}

const MULTI_TRUE_MULTI_FALSE_RULES = MULTI_TRUE_MULTI_FALSE.map(generateMinimalRule);
const MULTI_TRUE_SINGLE_FALSE_RULES = MULTI_TRUE_SINGLE_FALSE.map(generateMinimalRule);
const SINGLE_TRUE_MULTI_FALSE_RULES = SINGLE_TRUE_MULTI_FALSE.map(generateMinimalRule);

describe('helpers > open-feedback-modal > getFeedbackMessages', function() {
  it('should exist', function() {
    expect(getFeedbackMessages).to.be.a('function')
  })
  describe('when reducing a list of feedback messages to unique entries with counts', function() {
    it('The counts for both message classes should be > 1.',
      function() {
        const reduced = getFeedbackMessages(MULTI_TRUE_MULTI_FALSE_RULES)
        expect(reduced).to.deep.equal(['hit (3 matches)', 'miss (2 matches)'])
      })

    it('The counts for the success message class should be > 1. ' +
      'The count for the failure message class should be 1.',
      function() {
        const reduced = getFeedbackMessages(MULTI_TRUE_SINGLE_FALSE_RULES)
        expect(reduced).to.deep.equal(['hit (3 matches)', 'miss (1 match)'])
      })

    it('The counts for the failure message class should be > 1. ' +
      'The count for the success message class should be 1.',
      function() {
        const reduced = getFeedbackMessages(SINGLE_TRUE_MULTI_FALSE_RULES)
        expect(reduced).to.deep.equal(['hit (1 match)', 'miss (3 matches)'])
      })
  })
})
