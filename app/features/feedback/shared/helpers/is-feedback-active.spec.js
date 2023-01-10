import { expect } from 'chai';
import isFeedbackActive from './is-feedback-active';

describe('Feedback: isFeedbackActive', () => {
  const project = {
    experimental_tools: ['general feedback']
  };
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
  describe('with a valid project, workflow and subject', () => {
    it('should be true with a valid project, workflow and subject', () => {
      expect(isFeedbackActive(project, subject, workflow)).to.be.true;
    });
  });
  describe('with an invalid project, workflow or subject', () => {
    it('should be false with an invalid project', () => {
      expect(isFeedbackActive({}, subject, workflow)).to.be.false;
    });
    it('should be false with an invalid workflow', () => {
      expect(isFeedbackActive(project, subject, {})).to.be.false;
    });
    it('should be false with an invalid subject', () => {
      expect(isFeedbackActive(project, {}, workflow)).to.be.false;
    });
  });
});
