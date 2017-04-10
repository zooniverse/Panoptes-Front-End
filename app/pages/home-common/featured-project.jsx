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

const FeaturedProject = () => {
  return (
    <section className="home-featured">
      <h1 className="secondary-kicker">Featured Project</h1>
      <div className="home-featured-images">
        <img role="presentation" src="./assets/featured-projects/featured-project-20170407-etchacell.jpg" />
      </div>
      <h2 className="secondary-headline">New Project Launch - Etch a Cell</h2>
      <p className="display-body">The Zooniverse has just launched a brand new project to help improve understanding of cell biology.</p>
      <Link to="/projects/h-spiers/etch-a-cell" className="primary-button primary-button--light">Get involved!</Link>
    </section>
  );
};

export default FeaturedProject;
