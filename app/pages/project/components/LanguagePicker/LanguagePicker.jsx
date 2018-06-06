import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as translationsActions from '../../../../redux/ducks/translations';

function LanguagePicker(props) {
  const { actions, options, translations } = props;
  const { locale } = translations;

  function onChange(e) {
    actions.translations.setLocale(e.target.value);
  }

  return (
    <label>
      Language
      <select
        defaultValue={locale}
        onChange={onChange}
      >
        {options.map(option => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
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
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string
  })).isRequired,
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
