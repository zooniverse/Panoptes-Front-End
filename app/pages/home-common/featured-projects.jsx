import PropTypes from 'prop-types';
import React from 'react';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import FeaturedProjectEditor from '../projects/featured-project-editor';
import ProjectCard from '../../partials/project-card';

counterpart.registerTranslations('en', {
  homeFeaturedProjects: {
    header: 'Featured Projects'
  }
});

function FeaturedProjects({ projects }) {
  if (projects && projects.length > 0) {
    return (
      <section className="home-featured">
        <Translate className="secondary-kicker" component="h2" content="homeFeaturedProjects.header" />
        <div className="project-card-list">
          {projects.map(project => (
            <FeaturedProjectEditor key={project.id} project={project}>
              <ProjectCard project={project} />
            </FeaturedProjectEditor>
          ))}
        </div>
      </section>
    );
  }
  return null;
}

FeaturedProjects.defaultProps = {
  projects: []
};

FeaturedProjects.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.shape({
    avatar_src: PropTypes.string,
    description: PropTypes.string,
    display_name: PropTypes.string,
    links: PropTypes.shape({
      background: PropTypes.shape({
        href: PropTypes.string
      })
    }),
    slug: PropTypes.string
  }))
};

export default FeaturedProjects;
