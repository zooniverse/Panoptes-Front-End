import PropTypes from 'prop-types';
import React from 'react';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';
import { Helmet } from 'react-helmet';
import { Link, IndexLink } from 'react-router';

class AboutPage extends React.Component {
  componentDidMount() {
    if (document) {
      document.documentElement.classList.add('on-secondary-page');
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.logClick = !!nextContext &&
      !!nextContext.geordi &&
      !!nextContext.geordi.makeHandler &&
      nextContext.geordi.makeHandler('about-menu');
  }

  componentWillUnmount() {
    document.documentElement.classList.remove('on-secondary-page');
  }

  render() {
    return (
      <div className="secondary-page about-page">
        <Helmet title={counterpart('about.index.header')} />
        <section className="hero">
          <div className="hero-container">
            <Translate content="about.index.title" component="h1" />
            <nav className="hero-nav">
              <IndexLink
                to="/about"
                activeClassName="active"
              >
                <Translate content="about.index.nav.about" />
              </IndexLink>
              <Link
                to="/about/publications"
                activeClassName="active"
                onClick={this.logClick ? this.logClick.bind(this, 'about.index.nav.publications') : null}
              >
                <Translate content="about.index.nav.publications" />
              </Link>
              <Link
                to="/about/team"
                activeClassName="active"
                onClick={this.logClick ? this.logClick.bind(this, 'about.index.nav.team') : null}
              >
                <Translate content="about.index.nav.ourTeam" />
              </Link>
              <Link
                to="/about/acknowledgements"
                activeClassName="active"
                onClick={this.logClick ? this.logClick.bind(this, 'about.index.nav.acknowledgements') : null}
              >
                <Translate content="about.index.nav.acknowledgements" />
              </Link>
              <Link
                to="/about/contact"
                activeClassName="active"
                onClick={this.logClick ? this.logClick.bind(this, 'about.index.nav.contact') : null}
              >
                <Translate content="about.index.nav.contact" />
              </Link>
              <Link
                to="/about/faq"
                activeClassName="active"
                onClick={this.logClick ? this.logClick.bind(this, 'about.index.nav.faq') : null}
              >
                <Translate content="about.index.nav.faq" />
              </Link>
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