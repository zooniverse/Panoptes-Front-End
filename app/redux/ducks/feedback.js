// Actions
const CLEAR = 'pfe/feedback/CLEAR';
const SET = 'pfe/feedback/SET';

const initialState = [];

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CLEAR:
      return [];

    case SET:
      return [].concat(action.feedback);

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
