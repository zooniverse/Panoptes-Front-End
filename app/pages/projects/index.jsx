import counterpart from 'counterpart';
import React, { Component, PropTypes } from 'react';
import Translate from 'react-translate-component';
import { browserHistory, Link, IndexLink } from 'react-router';

counterpart.registerTranslations('en', {
  projectsHome: {
    title: 'Projects',
    nav: {
      live: 'Live',
      paused: 'Paused',
      finished: 'Finished',
    },
  },
});

class ProjectsPage extends Component {
  constructor(props) {
    super(props);
    this.updateQuery = this.updateQuery.bind(this);
  }

  getChildContext() {
    return { updateQuery: this.updateQuery };
  }

  componentWillMount() {
    const { status } = this.props.location.query;
    if (!status) {
      browserHistory.push('/projects?status=live');
    }
  }

  componentDidMount() {
    if (document) {
      document.title = 'Projects \u2014 Zooniverse';
      document.documentElement.classList.add('on-secondary-page');
    }
  }

  componentWillUnmount() {
    document.documentElement.classList.remove('on-secondary-page');
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
    return (
      <div className="secondary-page all-resources-page">
        <section className="hero projects-hero">
          <div className="hero-container">
            <Translate content="projectsHome.title" component="h1" />
            <nav className="hero-nav">
              <IndexLink to={{ pathname: '/projects', query: { status: 'live' } || null }} activeClassName="active">
                <Translate content="projectsHome.nav.live" />
              </IndexLink>
              <Link to={{ pathname: '/projects', query: { status: 'paused' } }} activeClassName="active">
                <Translate content="projectsHome.nav.paused" />
              </Link>
              <Link to={{ pathname: '/projects', query: { status: 'finished' } }} activeClassName="active">
                <Translate content="projectsHome.nav.finished" />
              </Link>
            </nav>
          </div>
        </section>
        <section className="resources-container">
          {this.props.children}
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
