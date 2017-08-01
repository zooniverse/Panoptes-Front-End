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
        alt="Steller Sea Lion"
        src="/assets/featured-projects/featured-project-20170801-steller.jpg"
      />
    </div>
    <h2 className="secondary-headline">Steller Watch</h2>
    <p className="display-body">Help us find out why the endangered Steller sea lion continues to decline in the Aleutian Islands.</p>
    <Link to="projects/sweenkl/steller-watch" className="primary-button primary-button--light">View Project!</Link>
  </section>
);

export default FeaturedProject;
