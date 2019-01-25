import PropTypes from 'prop-types';
import React from 'react';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';
import { Helmet } from 'react-helmet';
import { Link, IndexLink } from 'react-router';

class GetInvolved extends React.Component {
  componentWillReceiveProps(nextProps, nextContext) {
    this.logClick = !!nextContext &&
      !!nextContext.geordi &&
      !!nextContext.geordi.makeHandler &&
      nextContext.geordi.makeHandler('about-menu');
  }

  render() {
    return (
      <div className="secondary-page get-involved-page">
        <Helmet title={counterpart('getInvolved.index.title')} />
        <section className="hero">
          <div className="hero-container">
            <Translate content="getInvolved.index.title" component="h1" />
            <nav className="hero-nav">
              <ul>
                <li>
                  <IndexLink
                    to="/get-involved"
                    activeClassName="active"
                  >
                    <Translate content="getInvolved.index.nav.volunteering" />
                  </IndexLink>
                </li>
                <li>
                  <Link
                    to="/get-involved/education"
                    activeClassName="active"
                    onClick={this.logClick ? this.logClick.bind(this, 'getInvolved.index.nav.education') : null}
                  >
                    <Translate content="getInvolved.index.nav.education" />
                  </Link>
                </li>
                <li>
                  <Link
                    to="/get-involved/call-for-projects"
                    activeClassName="active"
                    onClick={this.logClick ? this.logClick.bind(this, 'getInvolved.index.nav.callForProjects') : null}
                  >
                    <Translate content="getInvolved.index.nav.callForProjects" />
                  </Link>
                </li>
                <li>
                  <Link
                    to="/collections"
                    activeClassname="active"
                    onClick={this.logClick ? this.logClick.bind(this, 'getInvolved.index.nav.collections-list') : null}
                  >
                    <Translate content="getInvolved.index.nav.collections" />
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </section>
        <section className="get-involved-page-content content-container">
          {this.props.children}
        </section>
      </div>
    );
  }
}

GetInvolved.contextTypes = {
  geordi: PropTypes.object
};

GetInvolved.propTypes = {
  children: PropTypes.node
};

GetInvolved.defaultProps = {
  children: null
};

export default GetInvolved;