import isFeedbackActive from './feedback/is-feedback-active';

// Actions
const CLEAR = 'pfe/feedback/CLEAR';
const INIT = 'pfe/feedback/INIT';
const UPDATE = 'pfe/feedback/UPDATE';

const initialState = {
  active: false
};

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CLEAR:
      return Object.assign({}, initialState);

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
    active: isFeedbackActive(project, subject, workflow)
  };
  return { type: INIT, payload };
}
