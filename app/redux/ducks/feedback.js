import _ from 'lodash';
import * as helpers from '../../features/feedback/shared/helpers';
import strategies from '../../features/feedback/shared/strategies';

// Actions
const INIT = 'pfe/feedback/INIT';
const UPDATE = 'pfe/feedback/UPDATE';

// Reducer
const initialState = {
  active: false,
  rules: {}
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case INIT: {
      return _.assign({}, initialState, {
        active: action.payload.active,
        rules: action.payload.rules
      });
    }

    case UPDATE: {
      const newState = _.clone(state);
      const { task, value } = action.payload.annotation;
      const activeRules = newState.rules[task];
      if (activeRules && activeRules.length) {
        newState.rules[task] = activeRules.map((rule) => {
          // The reducer is passed the entire set of annotations so we don't
          // have to write a separate handler for the `dud` strategy, which
          // needs to check there are no annotations at all.
          const ruleReducer = strategies[rule.strategy].reducer;
          return ruleReducer(rule, value);
        });
      }
      return newState;
    }

    default: {
      return state;
    }
  }
}

// Action Creators

// Check whether feedback is active, and set up a rule set for the current
// subject and workflow if so.
export function init(project, subject, workflow) {
  const payload = {
    active: helpers.isFeedbackActive(project, subject, workflow)
  };
  if (payload.active) {
    payload.rules = helpers.generateRules(subject, workflow);
  }
  return { type: INIT, payload };
}

// Update the ruleset and generate feedback
export function update(annotation) {
  const payload = {
    annotation
  };
  return { type: UPDATE, payload };
}
