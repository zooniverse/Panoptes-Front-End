import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as translationsActions from '../../../../redux/ducks/translations';
import languageMenu from '../../../../constants/languageMenu';

function LanguagePicker(props) {
  const { actions, project, translations } = props;
  const { locale } = translations;

  const languages = project.configuration.languages ? project.configuration.languages : [];

  if (languages.length < 2) {
    return null;
  }

  function onChange(e) {
    actions.translations.setLocale(e.target.value);
  }

  return (
    <label>
      Language
      {' '}
      <select
        defaultValue={locale}
        onChange={onChange}
      >
        {languages.map(language => (
          <option
            key={language}
            value={language}
          >
            {languageMenu[language]}
          </option>
          )
        )}
      </select>
    </label>
  );
}

LanguagePicker.propTypes = {
  actions: PropTypes.shape({
    translations: PropTypes.shape({
      setLocale: PropTypes.func
    })
  }),
  project: PropTypes.shape({
    configuration: PropTypes.shape({
      languages: PropTypes.arrayOf(PropTypes.string)
    })
  }).isRequired,
  translations: PropTypes.shape({
    locale: PropTypes.string
  })
};

LanguagePicker.defaultProps = {
  actions: {
    translations: {
      setLocale: () => null
    }
  },
  translations: {
    locale: 'en'
  }
};

const mapStateToProps = state => ({
  translations: state.translations
});

const mapDispatchToProps = dispatch => ({
  actions: {
    translations: bindActionCreators(translationsActions, dispatch)
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LanguagePicker);
export { LanguagePicker };
