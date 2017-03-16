import React from 'react';
import {Link} from 'react-router'

export default class FeaturedProject extends React.Component {
  render() {
    return (
      <section className="home-featured">
        <h1>Featured Projects</h1>
        <div className="home-featured-images">
          <img src="https://zooniverse-static.s3.amazonaws.com/www.penguinwatch.org/subjects/standard/58c29152f62070004000217f.JPG" />
          <img src="https://zooniverse-static.s3.amazonaws.com/www.penguinwatch.org/subjects/standard/58c29342f62070004001b6f7.JPG" />
          <img src="https://zooniverse-static.s3.amazonaws.com/www.penguinwatch.org/subjects/standard/58c29175f620700040003e01.JPG" />
        </div>
        <h2>Stargazing Live</h2>
        <p>Join Professor Brian Cox, Dara O&#769; Briain, and Julia Zemiro as they look for Planet Nine and other exoplanets live on <b>BBC Two</b> in the UK March 28 and <b>ABC</b> in Australia April 4.</p>
        <Link to="/projects" className="alternate-button">March 28: Planet Nine</Link>
      </section>
    );
  }
}
