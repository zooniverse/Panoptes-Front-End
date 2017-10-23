import apiClient from 'panoptes-client/lib/api-client';
import counterpart from 'counterpart';

counterpart.setFallbackLocale('en');
// Actions
const ERROR = 'pfe/translations/ERROR';
const LOAD = 'pfe/translations/LOAD';
const SET = 'pfe/translations/SET';

const initialState = {
  strings: {
    project: {},
    workflow: {
      tasks: {}
    }
  }
};

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET:
      const strings = Object.assign({}, state.strings, action.payload)
      return Object.assign({}, state, { strings });

    default:
      return state;
  }
}

// Action Creators
export function load(translated_type, translated_id, language) {
  counterpart.setLocale(language);
  return (dispatch) => {
    apiClient
      .type('translations')
      .get({ translated_type, translated_id, language })
      .then(([translation]) => {
        if (translation && translation.strings) {
          dispatch({
            type: SET,
            payload: {
              [translated_type]: translation.strings
            }
          });
        }
      })
      .catch(error => {
        console.warn(language.toUpperCase(), translated_type, translated_id, 'translation fetch error:', error.message);
        dispatch({ type: ERROR, payload: error });
      });
  };
}

