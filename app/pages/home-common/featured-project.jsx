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
import {Link} from 'react-router'

export default class FeaturedProject extends React.Component {
  render() {
    return (
      <section className="home-featured">
        <h1>Featured Project</h1>
        <div className="home-featured-images">
          <img src="./assets/featured-projects/featured-project-20170403-stargazing-live.jpg" />
        </div>
        <h2>Stargazing Live</h2>
        <p>The Zooniverse has teamed up with <a href="http://www.bbc.co.uk/programmes/b019h4g8">BBC Stargazing Live</a> to find exoplanets.</p>
        <Link to="/projects/ianc2/exoplanet-explorers" className="alternate-button">April 4: Exoplanet Explorer</Link>
      </section>
    );
  }
}
