import React from 'react';
import { Link } from 'react-router';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';

counterpart.registerTranslations('en', {
  projectCard: {
    button: 'View Project'
  }
});

const ProjectCard = ({ project }) => {
  const link = `/projects/${project.slug}`;
  const styles = {};

  if (project.avatar_src) {
    styles.backgroundImage = `url('//${project.avatar_src}')`;
  } else {
    styles.backgroundImage = "url('/assets/simple-pattern.png')";
  }

  return (
    <div className="home-social__project-card">
      <div className="home-social__project-card--background" style={styles}></div>
      <div className="home-social__project-card--content">
        <span className="display-body">{project.display_name}</span>
        <hr />
        <span className="regular-body">{project.description}</span>
        <Link className="primary-button" to={link}>
          <Translate content="projectCard.button" />
        </Link>
      </div>
    </div>
  );
};

ProjectCard.propTypes = {
  project: React.PropTypes.shape({
    avatar_src: React.PropTypes.string,
    description: React.PropTypes.string,
    display_name: React.PropTypes.string,
    slug: React.PropTypes.string
  })
};

export default ProjectCard;
