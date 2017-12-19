import React, { PropTypes } from 'react';
import ProjectNavbarNarrow from './components/ProjectNavbarNarrow';
import ProjectNavbarWide from './components/ProjectNavbarWide';


function ProjectNavbar(props) {
  return (
    <ProjectNavbarWide {...props} />
  );
}

ProjectNavbar.propTypes = {
  backgroundSrc: PropTypes.string
};

ProjectNavbar.defaultProps = {
  backgroundSrc: ''
};

export default ProjectNavbar;
