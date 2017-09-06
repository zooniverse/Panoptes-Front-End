import React from 'react';
import translations from './translations';

function ProjectTranslations(props) {
  let { project } = props;
  const projectStrings = translations.strings.project;
  projectStrings.display_name = projectStrings.title;
  project = Object.assign(project, projectStrings);

  return React.cloneElement(props.children, { project });
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

export default ProjectTranslations;
