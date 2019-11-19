import PropTypes from 'prop-types';
import React from 'react';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';
import { Helmet } from 'react-helmet';
import { Link, IndexLink } from 'react-router';

class AboutPage extends React.Component {
  componentWillReceiveProps(nextProps, nextContext) {
    this.logClick = !!nextContext &&
      !!nextContext.geordi &&
      !!nextContext.geordi.makeHandler &&
      nextContext.geordi.makeHandler('about-menu');
  }

  render() {
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
                  <Link
                    to="/about/publications"
                    activeClassName="active"
                    onClick={this.logClick ? this.logClick.bind(this, 'about.index.nav.publications') : null}
                  >
                    <Translate content="about.index.nav.publications" />
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about/team"
                    activeClassName="active"
                    onClick={this.logClick ? this.logClick.bind(this, 'about.index.nav.team') : null}
                  >
                    <Translate content="about.index.nav.ourTeam" />
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about/acknowledgements"
                    activeClassName="active"
                    onClick={this.logClick ? this.logClick.bind(this, 'about.index.nav.acknowledgements') : null}
                  >
                    <Translate content="about.index.nav.acknowledgements" />
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about/resources"
                    activeClassName="active"
                    onClick={this.logClick ? this.logClick.bind(this, 'about.index.nav.resources') : null}
                  >
                    <Translate content="about.index.nav.resources" />
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about/contact"
                    activeClassName="active"
                    onClick={this.logClick ? this.logClick.bind(this, 'about.index.nav.contact') : null}
                  >
                    <Translate content="about.index.nav.contact" />
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about/faq"
                    activeClassName="active"
                    onClick={this.logClick ? this.logClick.bind(this, 'about.index.nav.faq') : null}
                  >
                    <Translate content="about.index.nav.faq" />
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about/highlights"
                    activeClassName="active"
                    onClick={this.logClick ? this.logClick.bind(this, 'about.index.nav.highlights') : null}
                  >
                    <Translate content="about.index.nav.highlights" />
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about/donate"
                    activeClassName="active"
                    onClick={this.logClick ? this.logClick.bind(this, 'about.index.nav.donate') : null}
                  >
                    <Translate content="about.index.nav.donate" />
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </section>
        <section className="about-page-content content-container">
          {this.props.children}
        </section>
      </div>
    );
  }
}

AboutPage.contextTypes = {
  geordi: PropTypes.object
};

AboutPage.propTypes = {
  children: PropTypes.node
};

AboutPage.defaultProps = {
  children: null
};

export default AboutPage;
