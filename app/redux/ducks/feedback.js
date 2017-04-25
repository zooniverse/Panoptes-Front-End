// Actions
const CLEAR = 'pfe/feedback/CLEAR';
const SET = 'pfe/feedback/SET';

const initialState = {
  classifier: [],
  summary: []
};

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CLEAR:
      return Object.assign({}, initialState);

    case SET:
      return Object.assign({}, action.feedback);

    default:
      return state;
  }
}

// Action Creators
export function clearFeedback() {
  return { type: CLEAR };
}

export function setFeedback(feedback) {
  return { type: SET, feedback };
}
