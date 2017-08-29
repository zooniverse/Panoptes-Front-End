/*
Featured Project Component
==========================
* This component highlights specific projects on the home page.
* NOT to be confused with <HomePagePromoted />
* Content is hardcoded for the moment; improvements on this are welcome.
* Originally created to highlight 2017 Mar/Apr Stargazing Live projects.
* Design: @beckyrother; code: @shaunanoordin; documented/updated: 20170403
*/

import React from 'react';
import { Link } from 'react-router';

const FeaturedProject = (() =>
  <section className="home-featured">
    <h1 className="secondary-kicker">Featured Project</h1>
    <div className="home-featured-images">
      <img
        alt="Steelpan Vibrations"
        src="/assets/featured-projects/featured-project-20170829-steelpan_vibrations.jpg"
      />
    </div>
    <h2 className="secondary-headline">Steelpan Vibrations</h2>
    <p className="display-body">The distinct sound of the Caribbean steelpan is due largely to the interconnections between notes on the pan. We need help classifying vibration patterns so that we can learn more about how this drum works.</p>
    <Link to="projects/achmorrison/steelpan-vibrations" className="primary-button primary-button--light">View Project!</Link>
  </section>
);

export default FeaturedProject;
