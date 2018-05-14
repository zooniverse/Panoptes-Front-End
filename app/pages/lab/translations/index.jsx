import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import * as translationsActions from '../../../redux/ducks/translations';
import languageList from '../../../constants/languages';

class TranslationsManager extends React.Component {
  componentDidMount() {
    const { translations } = this.props.actions;
    translations.listLanguages('project', this.props.project.id);
  }

  render() {
    const { languages } = this.props.translations;
    const { project } = this.props;
    return (
      <div>
        <p>Manage your project translations here.</p>
        <ul>
          {languages.project && languages.project.map((languageCode) => {
            const language = languageList.filter(option => option.value === languageCode)[0] || {};
            const previewLink = (
              <li key={languageCode}>
                <Link to={`/projects/${project.slug}?language=${languageCode}`}>{language.label}</Link>
              </li>
            );
            return language.label ? previewLink : null;
          }
          )}
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
