import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../../../redux/ducks/translations';

function LanguagePicker(props) {
  function onChange(e) {
    props.actions.translations.setLocale(e.target.value);
  }

  return (
    <label>
      Language
      <select
        onChange={onChange}
      >
        <option value="en">English</option>
        <option value="nl">Nederlands</option>
      </select>
    </label>
  );
}

LanguagePicker.propTypes = {
  actions: PropTypes.shape({
    translations: PropTypes.shape({
      setLocale: PropTypes.func
    })
  })
};

LanguagePicker.defaultProps = {
  actions: {
    translations: {
      setLocale: () => null
    }
  }
};

const mapStateToProps = state => ({
  translations: state.translations
});

const mapDispatchToProps = dispatch => ({
  actions: {
    translations: bindActionCreators(actions, dispatch)
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LanguagePicker);
