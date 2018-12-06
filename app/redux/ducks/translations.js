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
const SET_TRANSLATION = 'pfe/translations/SET_TRANSLATION';
const SET_TRANSLATIONS = 'pfe/translations/SET_TRANSLATIONS';

const initialState = {
  locale: DEFAULT_LOCALE,
  languages: {
    project: []
  },
  rtl: false,
  strings: {
    project: {},
    workflow: { id: null },
    tutorial: {},
    minicourse: {},
    field_guide: {},
    project_page: []
  }
};

// Reducer
export default function reducer(state = initialState, action = {}) {
  let type, id, languageStrings, strings, translations;
  switch (action.type) {
    case SET_LANGUAGES:
      const languages = Object.assign({}, state.languages, { [action.payload.type]: action.payload.languages });
      return Object.assign({}, state, { languages });
    case SET_LOCALE:
      const locale = action.payload;
      const rtl = RTL_LANGUAGES.indexOf(locale) > -1;
      return Object.assign({}, state, { locale, rtl });
    case SET_TRANSLATION:
      ({ type, id, languageStrings } = action.payload);
      let translation = { id: id };
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
export function listLanguages(translated_type, translated_id) {
  return (dispatch) => {
    dispatch({ type: LOAD, payload: { translated_type, translated_id} });
    apiClient
      .type('translations')
      .get({ translated_type, translated_id })
      .then((translations) => {
        dispatch({
          type: SET_LANGUAGES,
          payload: {
            type: translated_type,
            languages: translations.map(translation => translation.language)
          }
        });
      })
      .catch((error) => {
        dispatch({ type: ERROR, payload: error });
      });
  };
}

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
              id: translation.id,
              languageStrings: translation.strings
            }
          });
        } else {
          dispatch({
            type: SET_TRANSLATION,
            payload: {
              type: resource_type,
              id: null,
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
