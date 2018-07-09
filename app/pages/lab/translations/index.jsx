import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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
    const languageCodes = languages.project
      .filter(languageCode => languageCode !== project.primary_language);
    const languageMenuCodes = Object.keys(languageMenu)
      .filter(language => languageCodes.indexOf(language) > -1);
    return (
      <div>
        <h1>Translations</h1>
        <h2>Project language menu</h2>
        <p>
          Tick languages here to add a language menu to your project,
          and make those translations available to your volunteers.
        </p>
        <table>
          <tr>
            <th>Language</th>
            <th>Code</th>
            <th>Live?</th>
          </tr>
          {languageMenuCodes.map(language => (
            <tr key={language}>
              <td>{languageMenu[language]}</td>
              <td>{language}</td>
              <td>
                <input
                  type="checkbox"
                  value={language}
                  checked={projectLanguages.indexOf(language) > -1}
                  onChange={this.handleMenuChange.bind(this)}
                />
              </td>
            </tr>
          ))}
        </table>
        <h2>Project translations</h2>
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
