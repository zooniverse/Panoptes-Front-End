import counterpart from 'counterpart';

const load = (language) => {
  const storedLanguage = localStorage.getItem('preferred-language');
  const defaultLanguage = 'en';
  language = language || storedLanguage || defaultLanguage;
  const location = `/translations/${language}.js`;
  return fetch(location).then((data) => {
    counterpart.registerTranslations(language, JSON.parse(data.response));
    counterpart.setLocale(language);
  });
};

const select = (language, user) => {
  if (user) {
    user.update({ languages: [language] });
    user.save;
  }
  return load(language)
    .then(localStorage.setItem('preferred-language'), language);
};

export default { load, select };
