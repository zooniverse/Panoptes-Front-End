import PropTypes from 'prop-types';
import React from 'react';
import merge from 'lodash/merge';
import { connect } from 'react-redux';

function Translations(props) {
  const { original, translations, type } = props;
  const { locale, rtl } = translations;
  const resourceTranslation = translations.strings[type][original.id];
  const languageStrings = resourceTranslation ? resourceTranslation.strings : {};
  const translation = merge({}, original, languageStrings);

  return React.cloneElement(props.children, { locale, rtl, translation });
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
