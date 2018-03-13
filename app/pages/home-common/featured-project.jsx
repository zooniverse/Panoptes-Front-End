import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import Thumbnail from '../../components/thumbnail';

function FeaturedProject({ project }) {
  if (project) {
    const featuredImage = (project.avatar_src && `https://${project.avatar_src}`);
    return (
      <section className="home-featured">
        <h1 className="secondary-kicker">Featured Project</h1>
        <div className="home-featured-images">
          <Thumbnail
            alt={project.display_name}
            height={400}
            src={featuredImage}
          />
        </div>
        <h2 className="secondary-headline">{project.display_name}</h2>
        <p className="display-body">{project.description}</p>
        <Link to={`/projects/${project.slug}`}>View Project!</Link>
      </section>
    );
  }
  return null;
}

FeaturedProject.propTypes = {
  project: PropTypes.shape({
    avatar_src: PropTypes.string,
    description: PropTypes.string,
    display_name: PropTypes.string,
    links: PropTypes.shape({
      background: PropTypes.shape({
        href: PropTypes.string
      })
    }),
    slug: PropTypes.string
  })
};

export default FeaturedProject;
