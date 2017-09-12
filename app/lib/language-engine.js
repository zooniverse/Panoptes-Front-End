import counterpart from 'counterpart';

const load = (language) => {
  const defaultLanguage = { label: 'English', value: 'en' };
  const storedLanguage = JSON.parse(localStorage.getItem('preferred-language'));
  const preferredLanguage = language || storedLanguage || defaultLanguage;
  const location = `/translations/${preferredLanguage.value}.json`;
  return fetch(location)
    .then(response => response.json())
    .then((json) => {
      counterpart.registerTranslations(preferredLanguage.value, json);
      counterpart.setLocale(preferredLanguage.value);
    });
};

const select = (language, user) => {
  if (user) {
    user.update({ languages: [language.value] });
    user.save;
  }
  return load(language).then(localStorage.setItem('preferred-language', JSON.stringify(language)));
};

export { load, select };
