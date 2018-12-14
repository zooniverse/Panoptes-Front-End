import apiClient from 'panoptes-client/lib/api-client';
import counterpart from 'counterpart';
import merge from 'lodash/merge';

const DEFAULT_LOCALE = counterpart.getLocale();
const RTL_LANGUAGES = [
  'ar',
  'he'
];

counterpart.setFallbackLocale(DEFAULT_LOCALE);

// Helpers

function explodeTranslationKey(translationKey, value) {
  const translationKeys = translationKey.split('.');
  const translationObject = {};
  let temp = translationObject;
  while (translationKeys.length) {
    temp[translationKeys[0]] = (translationKeys.length === 1) ? value : {};
    temp = temp[translationKeys[0]];
    translationKeys.shift();
  }
  return translationObject;
}

// Actions
const ERROR = 'pfe/translations/ERROR';
const LOAD = 'pfe/translations/LOAD';
const SET_LANGUAGES = 'pfe/translations/SET_LANGUAGES';
const SET_LOCALE = 'pfe/translations/SET_LOCALE';
const SET_TRANSLATIONS = 'pfe/translations/SET_TRANSLATIONS';

const initialState = {
  locale: DEFAULT_LOCALE,
  languages: {
    project: []
  },
  rtl: false,
  strings: {
    project: {},
    workflow: {},
    tutorial: {},
    minicourse: {},
    field_guide: {},
    project_page: {}
  }
};

// Reducer
export default function reducer(state = initialState, action = {}) {
  let type, strings, translations;
  switch (action.type) {
    case SET_LANGUAGES:
      const languages = Object.assign({}, state.languages, { [action.payload.type]: action.payload.languages });
      return Object.assign({}, state, { languages });
    case SET_LOCALE:
      const locale = action.payload;
      const rtl = RTL_LANGUAGES.indexOf(locale) > -1;
      return Object.assign({}, state, { locale, rtl });
    case SET_TRANSLATIONS: {
      const { translated_type, translations } = action.payload;
      const resourceTranslations = {};
      translations.forEach((translation, i) => {
        Object.keys(translation.strings).map((translationKey) => {
          const newTranslation = explodeTranslationKey(translationKey, translation.strings[translationKey]);
          translation.strings = merge(translation.strings, newTranslation);
          resourceTranslations[translation.translated_id] = translation;
        });
      });
      
      strings = Object.assign({}, state.strings, { [translated_type]: resourceTranslations });
      return Object.assign({}, state, { strings });
    }
    default:
      return state;
  }
}

// Action Creators
export function listLanguages(translated_type, translated_id) {
  return (dispatch) => {
    dispatch({
      type: LOAD,
      translated_type,
      translated_id
    });
    return apiClient
      .type('translations')
      .get({ translated_type, translated_id })
      .then((translations) => {
        return dispatch({
          type: SET_LANGUAGES,
          payload: {
            type: translated_type,
            languages: translations.map(translation => translation.language)
          }
        });
      })
      .catch((error) => {
        return dispatch({ type: ERROR, payload: error });
      });
  };
}

export function load(translated_type, translated_id, language) {
  counterpart.setLocale(language);
  return (dispatch) => {
    dispatch({
      type: LOAD,
      translated_type,
      translated_id,
      language
    });
    return apiClient
      .type('translations')
      .get({ translated_type, translated_id, language })
      .then((translations) => {
        if (translations) {
          return dispatch({
            type: SET_TRANSLATIONS,
            payload: {
              translated_type,
              translations
            }
          });
        }
      })
      .catch(error => {
        console.warn(
          translated_type,
          translated_id,
          `(${language})`,
          error.status,
          'translation fetch error:',
          error.message
        );
        return dispatch({ type: ERROR, payload: error });
      });
  };
}

export function setLocale(locale) {
  counterpart.setLocale(locale);
  return { type: SET_LOCALE, payload: locale };
}
