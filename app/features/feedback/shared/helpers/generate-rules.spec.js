import { expect } from 'chai';
import generateRules from './generate-rules';

describe('feedback: generateRules', function () {
  describe('without feedback defined', function () {
    const subject = {};
    const workflow = {};
    it('should return an empty object', function () {
      expect(generateRules(subject, workflow)).to.be.empty;
    });
  });
  describe('with task feedback enabled', function () {
    const subject = {
      metadata: {
        '#feedback_1_id': '51',
        '#feedback_1_answer': '0',
        '#feedback_1_failureMessage': 'Actually, this sound is from noise (background)',
        '#feedback_1_successMessage': 'Correct!'
      }
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
      },
      T1: {
        feedback: {
          enabled: false,
          rules: [{
            id: '52',
            strategy: 'singleAnswerQuestion',
            failureEnabled: true,
            successEnabled: true,
            defaultFailureMessage: '"Actually, that\'s not correct"',
            defaultSuccessMessage: '"Correct"'
          }]
        }
      }
    };
    it('should generate rules for tasks with feedback enabled', function () {
      expect(generateRules(subject, workflow)).to.have.property('T0');
    });
    it('should not generate rules for tasks with feedback disabled', function () {
      expect(generateRules(subject, workflow)).not.to.have.property('T1');
    });
    it('should copy subject rules', function () {
      const taskFeedbackRule = generateRules(subject, workflow).T0[0];
      expect(taskFeedbackRule).to.have.property('failureMessage');
      expect(taskFeedbackRule.failureMessage).to.equal('Actually, this sound is from noise (background)');
    });
    describe('if the rule ID is a number', function () {
      const newSubject = {
        metadata: {
          '#feedback_1_id': 51,
          '#feedback_1_answer': '0',
          '#feedback_1_failureMessage': 'Actually, this sound is from noise (background)',
          '#feedback_1_successMessage': 'Correct!'
        }
      };
      const newWorkflow = {
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
        },
        T1: {
          feedback: {
            enabled: false,
            rules: [{
              id: '52',
              strategy: 'singleAnswerQuestion',
              failureEnabled: true,
              successEnabled: true,
              defaultFailureMessage: '"Actually, that\'s not correct"',
              defaultSuccessMessage: '"Correct"'
            }]
          }
        }
      };
      it('should find tasks with feedback', function () {
        expect(generateRules(newSubject, newWorkflow)).to.have.property('T0');
      });
      it('should copy matching feedback rules', function () {
        const taskFeedbackRule = generateRules(newSubject, newWorkflow).T0[0];
        expect(taskFeedbackRule).to.have.property('failureMessage');
        expect(taskFeedbackRule.failureMessage).to.equal('Actually, this sound is from noise (background)');
      });
    });
    describe('if the rule ID is an alphanumeric string', function () {
      const newSubject = {
        metadata: {
          '#feedback_1_id': 'feedback rule',
          '#feedback_1_answer': '0',
          '#feedback_1_failureMessage': 'Actually, this sound is from noise (background)',
          '#feedback_1_successMessage': 'Correct!'
        }
      };
      const newWorkflow = {
        tasks: {
          T0: {
            feedback: {
              enabled: true,
              rules: [{
                id: 'feedback rule',
                strategy: 'singleAnswerQuestion',
                failureEnabled: true,
                successEnabled: true,
                defaultFailureMessage: '"Actually, that\'s not correct"',
                defaultSuccessMessage: '"Correct"'
              }]
            }
          }
        },
        T1: {
          feedback: {
            enabled: false,
            rules: [{
              id: '52',
              strategy: 'singleAnswerQuestion',
              failureEnabled: true,
              successEnabled: true,
              defaultFailureMessage: '"Actually, that\'s not correct"',
              defaultSuccessMessage: '"Correct"'
            }]
          }
        }
      };
      it('should find tasks with feedback', function () {
        expect(generateRules(newSubject, newWorkflow)).to.have.property('T0');
      });
      it('should copy matching feedback rules', function () {
        const taskFeedbackRule = generateRules(newSubject, newWorkflow).T0[0];
        expect(taskFeedbackRule).to.have.property('failureMessage');
        expect(taskFeedbackRule.failureMessage).to.equal('Actually, this sound is from noise (background)');
      });
    });
  });
});
