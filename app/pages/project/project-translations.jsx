import React from 'react';
import { connect } from 'react-redux';

function ProjectTranslations(props) {
  const { description, display_name, introduction, researcher_quote, title } = props.project;
  const projectStrings = props.translations.strings.project;
  const promotion_message = "Congratulations! You've unlocked the next workflow. If you prefer to stay on this workflow, you can choose to stay";
  const translation = Object.assign({ description, display_name, introduction, promotion_message, researcher_quote, title }, projectStrings);

  return React.cloneElement(props.children, { translation });
}

ProjectTranslations.propTypes = {
  children: React.PropTypes.node,
  project: React.PropTypes.shape({
    display_name: React.PropTypes.string,
    description: React.PropTypes.string,
    introduction: React.PropTypes.string,
    researcher_quote: React.PropTypes.string
  }).isRequired
};

const mapStateToProps = state => ({
  translations: state.translations
});

export default connect(mapStateToProps)(ProjectTranslations);
export { ProjectTranslations };

