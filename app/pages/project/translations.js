import apiClient from 'panoptes-client/lib/api-client';
import counterpart from 'counterpart';

counterpart.setFallbackLocale('en');


const translations = {
  strings: {
    project: {},
    workflow: {}
  },
  load: (translated_type, translated_id, language) => {
    counterpart.setLocale(language);
    return apiClient
      .type('translations')
      .get({ translated_type, translated_id, language })
      .then(([translation]) => {
        if (translation && translation.strings) {
          translations.strings[translated_type] = translation.strings;
        }
      })
      .catch(error => {
        console.warn(language.toUpperCase(), translated_type, translated_id, 'translation fetch error:', error.message);
      });
  }
};

export default translations;
