import PropTypes from 'prop-types';
import React from 'react';
import merge from 'lodash/merge';
import { connect } from 'react-redux';

function Translations(props) {
  const { original, translations, type } = props;
  const languageStrings = translations.strings[type];
  const translation = merge({}, original, languageStrings);

  return React.cloneElement(props.children, { translation });
}

Translations.propTypes = {
  children: PropTypes.node,
  original: PropTypes.shape({}),
  type: PropTypes.string
};

const mapStateToProps = state => ({
  translations: state.translations
});

export default connect(mapStateToProps)(Translations);
export { Translations };
