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
        <p>Add translations of your project to make it accessible to a wider range of volunteers.</p>
        <h2>Instructions</h2>
        <p>
          Follow the steps below to translate your project into non-English languages.
          <ol>
            <li><b>Grant Access:</b> Assign the "translator" role to individuals who will use the Zooniverse project translations interface (<a href="https://translations.zooniverse.org">https://translations.zooniverse.org</a>) to translate project-specific content into non-English languages. Assignment can be made via your project's <Link to={`/lab/${project.id}/collaborators`}>Collaborators page</Link>. Note: owners and collaborators already have access via their existing roles.</li>
            <li><b>Translate:</b> A translator logs on to the translations interface (<a href="https://translations.zooniverse.org">https://translations.zooniverse.org</a>) and creates an element-by-element translation of your project content. While your team is responsible for translating all project-specific content (workflow instructions, tutorials, about pages, etc.), the Zooniverse team manages translations of all shared platform-level content (e.g., labels for navigation buttons and links).</li>
            <li><b>View and Edit:</b> Once a translation has been created in the translations interface, the project team can preview a language translation using the "Preview" link provided below. Alternatively, the translation can be viewed by adding a language query param to the end of any project URL (e.g., https://www.zooniverse.org/projects/OWNER/PROJECT?language=fr).</li>
            <li><b>Validate:</b> Once a translation is complete, it is the responsibility of the project team to review the translation and confirm its quality. Teams can complete this check by previewing the translated content in their web browser, and use a browser's built-in translation tool to transform the translated content back to English for the purpose of checking its accuracy.</li>
            <li><b>Publish:</b> When a translation is ready to be made available to participants, it can be "published" by clicking the checkbox in the list below. This will add the option to a dropdown language selector available on project pages.</li>
          </ol>
        </p>
        {!hasTranslations &&
          <React.Fragment>
            <h2>Add translations to your project</h2>
            <p>Add some translators to your project from the <Link to={`/lab/${project.id}/collaborators`}>Collaborators page</Link> and invite them to add translations at <a href={`https://translations.zooniverse.org/#/project/${project.id}`}>https://translations.zooniverse.org/#/project/{project.id}</a></p>
          </React.Fragment>
        }
        <h2>Project language menu</h2>
        <p>
          Use the checkboxes below to make a translation available to project volunteers. If you created a project translation that does not appear in the checkbox list, the reason is typically because that language does not currently have platform-level translations available. In this case, please email <a href="mailto:contact@zooniverse.org">contact@zooniverse.org</a> with your project ID to discuss next steps for adding a platform-level translations for that language.
        </p>
        <table>
          <tr>
            <th>Language</th>
            <th>Publish</th>
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
