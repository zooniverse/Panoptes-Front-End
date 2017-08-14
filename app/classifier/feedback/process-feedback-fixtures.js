/* eslint
  func-names: 0,
  import/no-extraneous-dependencies: ['error', { 'devDependencies': true }]
  max-len: 0,
  no-underscore-dangle: 0,
  prefer-arrow-callback: 0,
  'react/jsx-boolean-value': ['error', 'always']
*/

const mockFeedbackRule = (processor, rule) => {
  processor.__Rewire__('FeedbackRuleSet', class FeedbackRuleSet {
    constructor() {
      this.rules = [rule];
    }
  });
};

const SUCCESS_MESSAGE = 'great success';

const FAILURE_MESSAGE = 'epic fail';

const SUBJECT = {
  metadata: { '#feedback_1_type': 'foo' }
};

const QUESTION = 'Is this a question?';

const TASK = {
  question: QUESTION
};

export {
  mockFeedbackRule,
  SUCCESS_MESSAGE,
  FAILURE_MESSAGE,
  SUBJECT,
  QUESTION,
  TASK
};
