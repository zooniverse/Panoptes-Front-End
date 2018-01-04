import React from 'react';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';
import { Helmet } from 'react-helmet';
import { Link, IndexLink } from 'react-router';

class GetInvolved extends React.Component {
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
      <div className="secondary-page get-involved-page">
        <Helmet title={counterpart('getInvolved.index.title')} />
        <section className="hero">
          <div className="hero-container">
            <Translate content="getInvolved.index.title" component="h1" />
            <nav className="hero-nav">
              <IndexLink
                to="/get-involved"
                activeClassName="active"
              >
                <Translate content="getInvolved.index.nav.volunteering" />
              </IndexLink>
              <Link
                to="/get-involved/education"
                activeClassName="active"
                onClick={this.logClick ? this.logClick.bind(this, 'getInvolved.index.nav.education') : null}
              >
                <Translate content="getInvolved.index.nav.education" />
              </Link>
              <Link
                to="/get-involved/call-for-projects"
                activeClassName="active"
                onClick={this.logClick ? this.logClick.bind(this, 'getInvolved.index.nav.callForProjects') : null}
              >
                <Translate content="getInvolved.index.nav.callForProjects" />
              </Link>
              <Link
                to="/collections"
                activeClassname="active"
                onClick={this.logClick ? this.logClick.bind(this, 'getInvolved.index.nav.collections-list') : null}
              >
                <Translate content="getInvolved.index.nav.collections" />
              </Link>
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
  geordi: React.PropTypes.object
};

GetInvolved.propTypes = {
  children: React.PropTypes.node
};

GetInvolved.defaultProps = {
  children: null
};

export default GetInvolved;
