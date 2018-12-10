import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

function ProjectTranslations(props) {
  const { description, display_name, introduction, researcher_quote, title } = props.project;
  const projectTranslation = props.translations.strings.project[props.project.id] || {};
  const projectStrings = projectTranslation.strings || {};
  const translation = Object.assign({ description, display_name, introduction, researcher_quote, title }, projectStrings);

  return React.cloneElement(props.children, { translation });
}

ProjectTranslations.propTypes = {
  children: PropTypes.node,
  project: PropTypes.shape({
    display_name: PropTypes.string,
    description: PropTypes.string,
    introduction: PropTypes.string,
    researcher_quote: PropTypes.string
  }).isRequired
};

const mapStateToProps = state => ({
  translations: state.translations
});

export default connect(mapStateToProps)(ProjectTranslations);
export { ProjectTranslations };
