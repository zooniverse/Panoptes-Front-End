/*
Featured Project Component
==========================
* This component highlights specific projects on the home page.
* NOT to be confused with <HomePagePromoted />
* Content is hardcoded for the moment; improvements on this are welcome.
* Originally created to highlight 2017 Mar/Apr Stargazing Live projects.
* Design: @beckyrother; code: @shaunanoordin; documented/updated: 20171023
* Compress and resize any static images before uploading and deploying!
*/

import React from 'react';
import { Link } from 'react-router';
import Thumbnail from '../../components/thumbnail';

const FeaturedProject = (() => (
  <section className="home-featured">
    <h1 className="secondary-kicker">Featured Project</h1>
    <div className="home-featured-images">
      <img
        alt="Fossil Atmospheres"
        src="/assets/featured-projects/featured-project-20171204-fossil_atmospheres.jpg"
      />
    </div>
    <h2 className="secondary-headline">Fossil Atmospheres</h2>
    <p className="display-body">Help us track climate change over millions of years! Count cells of modern & fossil leaves.</p>
    <Link to="projects/laurasoul/fossil-atmospheres">View Project!</Link>
  </section>
  )
);

export default FeaturedProject;
