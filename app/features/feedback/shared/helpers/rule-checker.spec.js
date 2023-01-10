import { expect } from 'chai';
import ruleChecker from './rule-checker';

describe('feedback: rule checker', () => {
  function generateValidRule(ruleID) {
    return {
      id: ruleID,
      strategy: 'singleAnswerQuestion',
      failureEnabled: true,
      successEnabled: true,
      defaultFailureMessage: '"Actually, that\'s not correct"',
      defaultSuccessMessage: '"Correct"'
    };
  }
  function generateInvalidRule(ruleID) {
    return {
      id: ruleID,
      strategy: '',
      failureEnabled: true,
      successEnabled: true,
      defaultFailureMessage: '"Actually, that\'s not correct"',
      defaultSuccessMessage: '"Correct"'
    };
  }
  const validRuleIDs = ['51', 51, 'hello world'];
  validRuleIDs.forEach((ruleID) => {
    describe(`with rule ID ${ruleID}`, () => {
      it('should return a valid rule', () => {
        const rule = generateValidRule(ruleID);
        expect(ruleChecker(rule)).to.deep.equal(rule);
      });
      it('should reject an invalid rule', () => {
        const rule = generateInvalidRule(ruleID);
        expect(ruleChecker(rule)).to.be.empty;
      });
    });
  });
});
