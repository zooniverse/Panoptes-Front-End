import PropTypes from 'prop-types';
import React from 'react';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';
import { Helmet } from 'react-helmet';
import { Link, IndexLink } from 'react-router';

function AboutPage({ children }) {
  let host = 'https://frontend.preview.zooniverse.org';
  if (window.location.hostname === 'www.zooniverse.org') {
    host = 'https://www.zooniverse.org';
  }

  return (
    <div className="secondary-page about-page">
      <Helmet title={counterpart('about.index.header')} />
      <section className="hero">
        <div className="hero-container">
          <Translate content="about.index.title" component="h1" />
          <nav className="hero-nav">
            <ul>
              <li>
                <IndexLink
                  to="/about"
                  activeClassName="active"
                >
                  <Translate content="about.index.nav.about" />
                </IndexLink>
              </li>
              <li>
                <a
                  href={`${host}/about/publications`}
                  activeClassName="active"
                >
                  <Translate content="about.index.nav.publications" />
                </a>
              </li>
              <li>
                <a
                  href={`${host}/about/team`}
                  activeClassName="active"
                >
                  <Translate content="about.index.nav.ourTeam" />
                </a>
              </li>
              <li>
                <Link
                  to="/about/acknowledgements"
                  activeClassName="active"
                >
                  <Translate content="about.index.nav.acknowledgements" />
                </Link>
              </li>
              <li>
                <Link
                  to="/about/resources"
                  activeClassName="active"
                >
                  <Translate content="about.index.nav.resources" />
                </Link>
              </li>
              <li>
                <Link
                  to="/about/contact"
                  activeClassName="active"
                >
                  <Translate content="about.index.nav.contact" />
                </Link>
              </li>
              <li>
                <Link
                  to="/about/faq"
                  activeClassName="active"
                >
                  <Translate content="about.index.nav.faq" />
                </Link>
              </li>
              <li>
                <Link
                  to="/about/highlights"
                  activeClassName="active"
                >
                  <Translate content="about.index.nav.highlights" />
                </Link>
              </li>
              <li>
                <Link
                  to="/about/mobile-app"
                  activeClassName="active"
                >
                  <Translate content="about.index.nav.mobileApp" />
                </Link>
              </li>
              <li>
                <Link
                  to="/about/donate"
                  activeClassName="active"
                >
                  <Translate content="about.index.nav.donate" />
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </section>
      <section className="about-page-content content-container">
        {children}
      </section>
    </div>
  );
}

AboutPage.propTypes = {
  children: PropTypes.node
};

AboutPage.defaultProps = {
  children: null
};

export default AboutPage;
