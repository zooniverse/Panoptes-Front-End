import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TranslationTools from './translation-tools';
import * as translationsActions from '../../../redux/ducks/translations';

class TranslationsManager extends React.Component {
  componentDidMount() {
    const { translations } = this.props.actions;
    translations.listLanguages('project', this.props.project.id);
  }

  render() {
    const { languages } = this.props.translations;
    const { project } = this.props;
    const languageCodes = languages.project
      .filter(languageCode => languageCode !== project.primary_language);
    return (
      <div>
        <p>Manage your project translations here.</p>
        <ul className="translations">
          {languageCodes.map(languageCode => (
            <li key={languageCode}>
              <TranslationTools
                languageCode={languageCode}
                project={project}
              />
            </li>
          ))}
        </ul>
      </div>
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

TranslationsManager.propTypes = {
  actions: PropTypes.shape({
    translations: PropTypes.shape({
      listLanguages: PropTypes.func
    })
  }).isRequired,
  translations: PropTypes.shape({
    languages: PropTypes.shape({
      project: PropTypes.arrayOf(PropTypes.string)
    })
  }),
  project: PropTypes.shape({
    id: PropTypes.string
  }).isRequired
};

TranslationsManager.defaultProps = {
  translations: {
    languages: {
      project: []
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(TranslationsManager);
export { TranslationsManager };
