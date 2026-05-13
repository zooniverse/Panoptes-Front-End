import { expect } from 'chai';
import isFeedbackActive from './is-feedback-active';

describe('Feedback: isFeedbackActive', function () {
  const workflow = {
    tasks: {
      T0: {
        feedback: {
          enabled: true,
          rules: [{
            id: '51',
            strategy: 'singleAnswerQuestion',
            failureEnabled: true,
            successEnabled: true,
            defaultFailureMessage: '"Actually, that\'s not correct"',
            defaultSuccessMessage: '"Correct"'
          }]
        }
      }
    }
  };
  const subject = {
    metadata: {
      '#feedback_1_id': '51',
      '#feedback_1_answer': '0',
      '#feedback_1_failureMessage': 'Actually, this sound is from noise (background)',
      '#feedback_1_successMessage': 'Correct!'
    }
  };
  describe('with a valid workflow and subject', function () {
    it('should be true with a valid workflow and subject', function () {
      expect(isFeedbackActive(subject, workflow)).to.be.true;
    });
  });
  describe('with an invalid workflow or subject', function () {
    it('should be false with an invalid workflow', function () {
      expect(isFeedbackActive(subject, {})).to.be.false;
    });
    it('should be false with an invalid subject', function () {
      expect(isFeedbackActive({}, workflow)).to.be.false;
    });
  });
});
