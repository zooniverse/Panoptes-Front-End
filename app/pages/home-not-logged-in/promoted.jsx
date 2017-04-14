import React from 'react';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import { Link } from 'react-router';

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

const HomePagePromoted = ({ }) => {
  return (
    <section className="home-promoted">
      <Translate className="tertiary-kicker" content="promotedHomePage.discover" />
      <Translate className="display-body" content="promotedHomePage.participate" />

      <Link to="/projects" className="primary-button primary-button--light">See All Projects</Link>
    </section>
  );
};

HomePagePromoted.propTypes = {
};

export default HomePagePromoted;
