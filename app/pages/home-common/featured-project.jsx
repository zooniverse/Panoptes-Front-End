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
        alt="Star forming gas cloud in the Milky Way."
        src="./assets/featured-projects/featured-project-20170711-milky-way.jpg"
      />
    </div>
    <h2 className="secondary-headline">Milky Way Project</h2>
    <p className="display-body">We need your help to explore our home galaxy, looking for signs of stars being born.</p>
    <Link to="projects/povich/milky-way-project" className="primary-button primary-button--light">View Project!</Link>
  </section>
);

export default FeaturedProject;
