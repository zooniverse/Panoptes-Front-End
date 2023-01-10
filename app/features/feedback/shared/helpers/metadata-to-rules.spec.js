import { expect } from 'chai';
import sinon from 'sinon';
import metadataToRules from './metadata-to-rules';

describe('feedback: metadataToRules', () => {
  function mockSubjectWithRule(ruleID) {
    return {
      metadata: {
        '#feedback_1_id': ruleID,
        '#feedback_1_answer': '0',
        '#feedback_1_failureMessage': 'Actually, this sound is from noise (background)',
        '#feedback_1_successMessage': 'Correct!',
        foo: null,
        bar: undefined
      }
    };
  }

  function mockSubjectWithRuleNonIntegerN(ruleID) {
    return {
      metadata: {
        '#feedback_[1]_id': ruleID,
        '#feedback_a_answer': '0',
        '#feedback_1a2b_failureMessage': 'Actually, this sound is from noise (background)',
        foo: null,
        bar: undefined
      }
    };
  }

  function expectedRules(ruleID) {
    return [{
      id: ruleID,
      answer: '0',
      failureMessage: 'Actually, this sound is from noise (background)',
      successMessage: 'Correct!'
    }];
  }

  it('should generate a rules object for string IDs', () => {
    const subject = mockSubjectWithRule('0');
    const rules = metadataToRules(subject.metadata);
    expect(rules).to.deep.equal(expectedRules('0'));
  });

  it('should generate a rules object for numerical IDs', () => {
    const subject = mockSubjectWithRule(0);
    const rules = metadataToRules(subject.metadata);
    expect(rules).to.deep.equal(expectedRules(0));
  });

  describe('with subject metadata feedback ruleIndex not an integer', () => {
    let logError;
    before(() => {
      logError = sinon.stub(console, 'error');
    });

    after(() => {
      console.error.restore();
    });

    it('should console error with message', () => {
      const improperMetadataSubject = mockSubjectWithRuleNonIntegerN(0);
      metadataToRules(improperMetadataSubject.metadata);

      expect(logError).to.have.been.calledThrice;
      expect(logError).to.have.been.calledWith('Subject metadata feedback rule index [1] is improperly formatted. The feedback rule index should be an integer.');
    });
  });

  describe('with undefined metadata', () => {
    it('should generate an empty rules object', () => {
      expect(metadataToRules()).to.be.empty;
    });
  });
});
