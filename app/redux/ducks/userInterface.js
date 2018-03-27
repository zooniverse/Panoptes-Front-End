import FakeLocalStorage from '../../../test/fake-local-storage';
import { zooTheme } from '../../theme';

// Fall back when not in browser environment, tests, etc
const storage = window.localStorage || new FakeLocalStorage();

// Actions
const SET_THEME = 'pfe/userInterface/SET_THEME';

// State
const initialState = {
  theme: storage.getItem('theme') || zooTheme.mode.light
};

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_THEME:
      storage.setItem('theme', action.payload);
      return Object.assign({}, state, { theme: action.payload });

    default:
      return state;
  }
}

// Action Creators
export function setTheme(theme) {
  return { type: SET_THEME, payload: theme };
}
