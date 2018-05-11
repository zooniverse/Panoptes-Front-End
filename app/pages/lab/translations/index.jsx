import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as translationsActions from '../../../redux/ducks/translations';

class TranslationsManager extends React.Component {
  render() {
    return (
      <p>Manage your project translations here.</p>
    );
  }
}

const mapStateToProps = state => ({
  translations: state.translations
});

const mapDispatchToProps = dispatch => ({
  actions: {
    translations: bindActionCreators(translationsActions, dispatch)
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(TranslationsManager);
export { TranslationsManager };
