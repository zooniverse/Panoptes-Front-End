import counterpart from 'counterpart';
import React, { Component, PropTypes } from 'react';
import Translate from 'react-translate-component';
import { browserHistory } from 'react-router';

import StatusLink from './status-link';

counterpart.registerTranslations('en', {
  projectsHome: {
    title: 'Projects',
    nav: {
      active: 'Active',
      paused: 'Paused',
      finished: 'Finished',
    },
  },
});

class ProjectsPage extends Component {
  constructor(props) {
    super(props);
    this.updateQuery = this.updateQuery.bind(this);
    this.checkURLForStatusFilter = this.checkURLForStatusFilter.bind(this);
  }

  getChildContext() {
    return { updateQuery: this.updateQuery };
  }

  componentWillMount() {
    this.checkURLForStatusFilter(this.props);
  }

  componentDidMount() {
    if (document) {
      document.title = 'Projects \u2014 Zooniverse';
      document.documentElement.classList.add('on-secondary-page');
    }
  }

  componentWillReceiveProps(nextProps) {
    this.checkURLForStatusFilter(nextProps);
  }

  componentWillUnmount() {
    document.documentElement.classList.remove('on-secondary-page');
  }

//  Makes sure the active class is applied also when status param is null
  checkURLForStatusFilter(props) {
    const { location } = props;
    if (!location.query.status) {
      this.updateQuery({ status: 'live' });
    }
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
        <section className="hero projects-hero">
          <div className="hero-container">
            <Translate content="projectsHome.title" component="h1" />
            <nav className="hero-nav">
              <StatusLink location={location} status="live" updateQuery={this.updateQuery}>
                <Translate content="projectsHome.nav.active" />
              </StatusLink>
              <StatusLink location={location} status="paused" updateQuery={this.updateQuery}>
                <Translate content="projectsHome.nav.paused" />
              </StatusLink>
              <StatusLink location={location} status="finished" updateQuery={this.updateQuery}>
                <Translate content="projectsHome.nav.finished" />
              </StatusLink>
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
  updateQuery: React.PropTypes.func,
};

ProjectsPage.propTypes = {
  children: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

ProjectsPage.defaultProps = {
  location: {
    query: {
      discipline: '',
      page: '1',
      sort: '-launch_date',
      status: 'live',
    },
  },
};

export default ProjectsPage;
