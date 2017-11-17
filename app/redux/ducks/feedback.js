import * as helpers from '../../features/feedback/shared/helpers';
import FeedbackRuleSet from './feedback/feedback-ruleset';

// Actions
const INIT = 'pfe/feedback/INIT';
const UPDATE = 'pfe/feedback/UPDATE';

const initialState = {
  active: false,
  subjectRules: [],
  workflowRules: []
};

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case INIT:
      return Object.assign({}, initialState, action.payload);

    case UPDATE:
      return Object.assign({}, state, action.payload);

    default:
      return state;
  }
}

// Action Creators
export function init(project, subject, workflow) {
  const payload = {
    active: helpers.isFeedbackActive(project, subject, workflow)
  };
  if (payload.active) {
    payload.subjectRules = helpers.metadataToRules(subject.metadata);
    payload.workflowRules = helpers.getFeedbackFromTasks(workflow.tasks);
  }
  return { type: INIT, payload };
}

export function update(subject, task, annotation) {
  // console.info('update', arguments);
  const rules = new FeedbackRuleSet(subject, task);
  console.log('rules', rules);
  const payload = {
  };
  return { type: UPDATE, payload };
}
