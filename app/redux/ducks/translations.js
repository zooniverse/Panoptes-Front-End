import apiClient from 'panoptes-client/lib/api-client';
import counterpart from 'counterpart';

const DEFAULT_LOCALE = counterpart.getLocale();

counterpart.setFallbackLocale(DEFAULT_LOCALE);
// Actions
const ERROR = 'pfe/translations/ERROR';
const LOAD = 'pfe/translations/LOAD';
const SET_LOCALE = 'pfe/translations/SET_LOCALE';
const SET_STRINGS = 'pfe/translations/SET_STRINGS';

const initialState = {
  locale: DEFAULT_LOCALE,
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
    case SET_LOCALE:
      return Object.assign({}, state, { locale: action.payload });
    case SET_STRINGS:
      const strings = Object.assign({}, state.strings, action.payload);
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
            type: SET_STRINGS,
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

export function setLocale(locale) {
  counterpart.setLocale(locale);
  return { type: SET_LOCALE, payload: locale };
}

