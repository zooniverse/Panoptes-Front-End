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

export default class FeaturedProject extends React.Component {
  render() {
    return (
      <section className="home-featured">
        <h1>Featured Project</h1>
        <div className="home-featured-images">
          <img
            alt="The direct image (left) and dispersed spectrum (right) of a real galaxy from the WISP survey. The white arrow shows the bright light produced by an emission line."
            src="./assets/featured-projects/featured-project-20170531-galaxy-nurseries.jpg"
          />
        </div>
        <h2>Introducing the 100th Zooniverse project - Galaxy Nurseries</h2>
        <p>Help researchers figure out how our universe has changed over time by finding baby galaxies.</p>
        <Link to="projects/hughdickinson/galaxy-nurseries" className="alternate-button">Get involved!</Link>
      </section>
    );
  }
}
