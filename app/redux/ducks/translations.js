import apiClient from 'panoptes-client/lib/api-client';
import counterpart from 'counterpart';
import merge from 'lodash/merge';

const DEFAULT_LOCALE = counterpart.getLocale();

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
const SET_LOCALE = 'pfe/translations/SET_LOCALE';
const SET_TRANSLATION = 'pfe/translations/SET_TRANSLATION';
const SET_TRANSLATIONS = 'pfe/translations/SET_TRANSLATIONS';

const initialState = {
  locale: DEFAULT_LOCALE,
  strings: {
    project: {},
    workflow: {},
    tutorial: {},
    minicourse: {},
    field_guide: {},
    project_page: []
  }
};

// Reducer
export default function reducer(state = initialState, action = {}) {
  let type, languageStrings, strings, translations;
  switch (action.type) {
    case SET_LOCALE:
      return Object.assign({}, state, { locale: action.payload });
    case SET_TRANSLATION:
      ({ type, languageStrings } = action.payload);
      let translation = {};
      Object.keys(languageStrings).map((translationKey) => {
        const newTranslation = explodeTranslationKey(translationKey, languageStrings[translationKey]);
        translation = merge(translation, newTranslation);
      });
      strings = Object.assign({}, state.strings, { [type]: translation });
      return Object.assign({}, state, { strings });
    case SET_TRANSLATIONS:
      ({ type, translations } = action.payload);
      translations.forEach((translation, i) => {
        Object.keys(translation.strings).map((translationKey) => {
          const newTranslation = explodeTranslationKey(translationKey, translation.strings[translationKey]);
          translation.strings = merge(translation.strings, newTranslation);
          translations[i] = translation;
        });
      });
      
      strings = Object.assign({}, state.strings, { [type]: translations });
      return Object.assign({}, state, { strings });
    default:
      return state;
  }
}

// Action Creators
export function load(resource_type, translated_id, language) {
  counterpart.setLocale(language);
  const translated_type = resource_type === 'minicourse' ? 'tutorial' : resource_type;
  return (dispatch) => {
    dispatch({ type: LOAD, payload: { translated_type, translated_id, language } });
    apiClient
      .type('translations')
      .get({ translated_type, translated_id, language })
      .then(([translation]) => {
        if (translation && translation.strings) {
          dispatch({
            type: SET_TRANSLATION,
            payload: {
              type: resource_type,
              languageStrings: translation.strings
            }
          });
        } else {
          dispatch({
            type: SET_TRANSLATION,
            payload: {
              type: resource_type,
              languageStrings: {}
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
        dispatch({ type: ERROR, payload: error });
      });
  };
}

export function loadTranslations(translated_type, translated_id, language) {
  counterpart.setLocale(language);
  return (dispatch) => {
    dispatch({
      type: LOAD,
      translated_type,
      translated_id,
      language
    });
    apiClient
      .type('translations')
      .get({ translated_type, translated_id, language })
      .then((translations) => {
        if (translations) {
          dispatch({
            type: SET_TRANSLATIONS,
            payload: {
              type: translated_type,
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
        dispatch({ type: ERROR, payload: error });
      });
  };
}

export function setLocale(locale) {
  counterpart.setLocale(locale);
  return { type: SET_LOCALE, payload: locale };
}

