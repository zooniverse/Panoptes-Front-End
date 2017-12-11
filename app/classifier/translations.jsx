import React from 'react';
import merge from 'lodash/merge';
import { connect } from 'react-redux';

function Translations(props) {
  const { original, translations, type } = props;
  const languageStrings = translations.strings[type];
  let translation = merge({}, original);

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

  Object.keys(languageStrings).map((translationKey) => {
    const newTranslation = explodeTranslationKey(translationKey, languageStrings[translationKey]);
    translation = merge(translation, newTranslation);
  });

  return React.cloneElement(props.children, { translation });
}

Translations.propTypes = {
  children: React.PropTypes.node,
  original: React.PropTypes.shape({}),
  type: React.PropTypes.string
};

const mapStateToProps = state => ({
  translations: state.translations
});

export default connect(mapStateToProps)(Translations);
export { Translations };
