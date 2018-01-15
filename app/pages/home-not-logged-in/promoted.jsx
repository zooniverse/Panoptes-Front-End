import PropTypes from 'prop-types';
import React from 'react';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import { Link } from 'react-router';
import ProjectCard from '../../partials/project-card';
import LoadingIndicator from '../../components/loading-indicator';

counterpart.registerTranslations('en', {
  promotedHomePage: {
    discover: 'What Will You Discover?',
    participate: `
      Participate in research of all kinds, from classifying galaxies to counting
      penguins to transcribing manuscripts. Whatever your interest, there's a
      Zooniverse project for you.
    `
  }
});

const HomePagePromoted = ({ promotedProjects }) => {
  return (
    <section className="home-promoted">

      <div className="home-promoted__content">
        <Translate className="tertiary-kicker" content="promotedHomePage.discover" />
        <Translate className="display-body" content="promotedHomePage.participate" />
      </div>

      {!promotedProjects.length && (<LoadingIndicator />)}

      <div className="home-promoted__cards">
        {promotedProjects.map((project) => {
          return (
            <div key={project.id}>
              <ProjectCard
                className="home-page-not-logged-in__project-card"
                imageSrc={project.image}
                landingPage={true}
                project={project}
              />
            </div>);
        })}
      </div>

      <Link to="/projects" className="primary-button primary-button--light">See All Projects</Link>
    </section>
  );
};

HomePagePromoted.propTypes = {
  promotedProjects: PropTypes.arrayOf(PropTypes.object)
};

export default HomePagePromoted;