import counterpart from 'counterpart';

const load = (language) => {
  const storedLanguage = localStorage.getItem('preferred-language');
  const defaultLanguage = 'en';
  language = language || storedLanguage || defaultLanguage;
  const location = `/translations/${language.value}.json`;
  return fetch(location)
    .then(response => response.json())
    .then((json) => {
      counterpart.registerTranslations(language.value, json);
      counterpart.setLocale(language.value);
    });
};

const select = (language, user) => {
  if (user) {
    user.update({ languages: [language] });
    user.save;
  }
  return load(language).then(localStorage.setItem('preferred-language', language.value));
};

export { load, select };
