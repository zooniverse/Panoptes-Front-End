import isFeedbackActive from './feedback/is-feedback-active';

// Actions
const CLEAR = 'pfe/feedback/CLEAR';
const UPDATE = 'pfe/feedback/UPDATE';

const initialState = {
  active: false
};

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CLEAR:
      return Object.assign({}, initialState);

    case UPDATE:
      return Object.assign({}, state, action.payload);

    default:
      return state;
  }
}

// Action Creators
export function clearFeedback() {
  return { type: CLEAR };
}

export function updateFeedback({ project }) {
  const payload = {
    active: isFeedbackActive(project)
  };
  return { type: UPDATE, payload };
}
