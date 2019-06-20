import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import TranslationTools from './translation-tools';
import * as translationsActions from '../../../redux/ducks/translations';
import languageMenu from '../../../constants/languageMenu';

class TranslationsManager extends React.Component {
  constructor(props) {
    super(props);
    const { project } = props;
    const languages = project.configuration.languages || [project.primary_language];
    this.state = {
      languages
    };
  }

  componentDidMount() {
    const { translations } = this.props.actions;
    translations.listLanguages('project', this.props.project.id);
  }

  handleMenuChange(e) {
    const { project } = this.props;
    const { languages } = this.state;
    const language = e.target.value;
    const index = languages.indexOf(language);
    if (index > -1) {
      languages.splice(index, 1);
    }
    if (e.target.checked) {
      languages.push(language);
    }
    project.update({ 'configuration.languages': languages }).save();
    this.setState({ languages });
  }

  render() {
    const { languages } = this.props.translations;
    const { project } = this.props;
    const projectLanguages = this.state.languages;
    const translationLanguages = languages.project
      .filter(languageCode => languageCode !== project.primary_language);
    const languageMenuCodes = Object.keys(languageMenu)
      .filter(language => translationLanguages.indexOf(language) > -1);
    languageMenuCodes.unshift(project.primary_language);
    const hasTranslations = translationLanguages.length > 0;
    return (
      <div>
        <h1>Translations</h1>
        {!hasTranslations &&
          <React.Fragment>
            <h2>Add translations to your project</h2>
            <p>Add some translators to your project from the <Link to={`/lab/${project.id}/collaborators`}>Collaborators page</Link> and invite them to add translations at <a href={`https://translations.zooniverse.org/#/project/${project.id}`}>https://translations.zooniverse.org/#/project/{project.id}</a></p>
          </React.Fragment>
        }
        <h2>Project language menu</h2>
        <p>
          Tick languages here to publish those translations, and make them available to your volunteers.
        </p>
        <table>
          <tr>
            <th>Language</th>
            <th>Published?</th>
          </tr>
          {languageMenuCodes.map((language) => {
            const disabled = language === project.primary_language;
            const checked = projectLanguages.indexOf(language) > -1;
            return (
              <tr key={language}>
                <td>{languageMenu[language]} ({language})</td>
                <td>
                  <input
                    type="checkbox"
                    value={language}
                    checked={checked}
                    disabled={disabled}
                    onChange={this.handleMenuChange.bind(this)}
                  />
                </td>
              </tr>
            );
          })}
        </table>
        {!!hasTranslations &&
          <React.Fragment>
            <h2>Project translations</h2>
            <ul className="translations">
              {translationLanguages.map(languageCode => (
                <li key={languageCode}>
                  <TranslationTools
                    languageCode={languageCode}
                    project={project}
                  />
                </li>
              ))}
            </ul>
          </React.Fragment>
        }
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
  actions: {
    translations: {
      listLanguages: () => null
    }
  },
  project: {
    configuration: {}
  },
  translations: {
    languages: {
      project: []
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(TranslationsManager);
export { TranslationsManager };
