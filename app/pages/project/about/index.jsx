import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import counterpart from 'counterpart';
import AboutNav from './about-nav';
import apiClient from 'panoptes-client/lib/api-client';

const SLUG_MAP = {
  science_case: 'research',
  team: 'team',
  results: 'results',
  education: 'education',
  faq: 'faq',
};

class AboutProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pages: [],
      team: [],
      loaded: false,
    };
  }

  componentDidMount() {
    this.getPages();
  }

  constructPagesData() {
    const availablePages = [];

    for (const url_key in SLUG_MAP) {
      const matchingPage = this.props.pages.find(page => page.url_key === url_key);
      if (matchingPage && matchingPage.content && matchingPage.content !== '') {
        availablePages.push({
          slug: SLUG_MAP[url_key],
          title: matchingPage.title,
          content: matchingPage.content,
        });
      } else if (['science_case', 'team'].includes(url_key)) {
        availablePages.push({ slug: SLUG_MAP[url_key] });
      }
    }

    return availablePages;
  }

  getPages() {
    this.getTeam();
    this.setState({
      pages: this.constructPagesData(),
      loaded: true
    });
  }

  getTeam() {
    if (this.props.projectRoles.length > 0) {
      const userIds = this.props.projectRoles.map(role => role.links.owner.id);
      return apiClient.type('users').get(userIds)
        .then(users => this.constructTeamData(this.props.projectRoles, users))
        .catch((error) => console.error('Error retrieving project team users', error));
    }
  }

  constructTeamData(roles, users) {
    Promise.resolve(
      users.map(user => ({
        userResource: user,
        roles: roles.find(role => user.id === role.links.owner.id).roles
      }))).then(team => this.setState({ team }));
  }

  render() {
    return (this.state.loaded)
      ? this.renderAbout()
      : null;
  }

  renderAbout() {
    const { state: { pages, team }, props: { children, project } } = this;
    return (
      <div className="project-about-page">
        <Helmet title={`${this.props.project.display_name} » ${counterpart('about.header')}`} />
        <AboutNav pages={pages} projectPath={`/projects/${project.slug}`} />
        {React.cloneElement(children, {project, pages, team})}
      </div>
    );
  }
}

export default AboutProject;
