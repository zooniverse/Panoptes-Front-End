import counterpart from 'counterpart';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Translate from 'react-translate-component';
import { browserHistory } from 'react-router';
import { Helmet } from 'react-helmet';

import StatusLink from './status-link';

counterpart.registerTranslations('en', {
  projectsHome: {
    title: 'Projects',
    nav: {
      active: 'Active',
      paused: 'Paused',
      finished: 'Finished'
    }
  }
});

class ProjectsPage extends Component {
  constructor(props) {
    super(props);
    this.updateQuery = this.updateQuery.bind(this);
  }

  getChildContext() {
    return { updateQuery: this.updateQuery };
  }

  updateQuery(newParams) {
    const query = Object.assign({}, this.props.location.query, newParams);
    const results = [];
    Object.keys(query).map((key) => {
      if (query[key] === '') {
        results.push(delete query[key]);
      }
      return results;
    });
    const newLocation = Object.assign({}, this.props.location, { query });
    newLocation.search = '';
    browserHistory.push(newLocation);
  }

  render() {
    const { children, location } = this.props;
    return (
      <div className="secondary-page all-resources-page">
        <Helmet title={counterpart('projectsHome.title')} />
        <section className="hero projects-hero">
          <div className="hero-container">
            <Translate content="projectsHome.title" component="h1" />
            <nav className="hero-nav" role="tablist">
              <ul>
                <li>
                  <StatusLink location={location} status="live" updateQuery={this.updateQuery}>
                    <Translate content="projectsHome.nav.active" />
                  </StatusLink>
                </li>
                <li>
                  <StatusLink location={location} status="paused" updateQuery={this.updateQuery}>
                    <Translate content="projectsHome.nav.paused" />
                  </StatusLink>
                </li>
                <li>
                  <StatusLink location={location} status="finished" updateQuery={this.updateQuery}>
                    <Translate content="projectsHome.nav.finished" />
                  </StatusLink>
                </li>
              </ul>
            </nav>
          </div>
        </section>
        <section className="resources-container">
          {children}
        </section>
      </div>
    );
  }
}

ProjectsPage.childContextTypes = {
  updateQuery: PropTypes.func
};

ProjectsPage.propTypes = {
  children: PropTypes.object.isRequired,
  location: PropTypes.shape({
    query: PropTypes.object
  })
};

ProjectsPage.defaultProps = {
  location: {
    query: {
      discipline: '',
      page: '1',
      sort: '-launch_date',
      status: 'live'
    }
  }
};

export default ProjectsPage;