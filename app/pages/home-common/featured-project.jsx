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
        alt="Planetary Response Network & Rescue Global: Caribbean Storms 2017"
        src="/assets/featured-projects/featured-project-20170913-irma.jpg"
      />
    </div>
    <h2 className="secondary-headline">Caribbean Storms 2017</h2>
    <p className="display-body">Check back daily to join the relief effort to help the victims of Hurricane Irma.</p>
    <Link to="projects/vrooje/planetary-response-network-and-rescue-global-caribbean-storms-2017">View Project!</Link>
  </section>
);

export default FeaturedProject;
