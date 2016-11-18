import React, { Component } from 'react';
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
    this.renderAbout = this.renderAbout.bind(this);
    this.getPages = this.getPages.bind(this);
    this.constructPagesData = this.constructPagesData.bind(this);
    this.getTeam = this.getTeam.bind(this);
    this.constructTeamData = this.constructTeamData.bind(this);
    this.state = {
      pages: [],
      team: [],
      loaded: false,
    };
  }

  componentDidMount() {
    this.getPages();
  }

  constructPagesData(apiResponse) {
    const availablePages = [];
    for (const url_key in SLUG_MAP) {
      const matchingPage = apiResponse.find(page => page.url_key === url_key);
      if (matchingPage && matchingPage.content && matchingPage.content !== '') {
        availablePages.push({
          slug: SLUG_MAP[url_key],
          title: matchingPage.title,
          content: matchingPage.content,
        });
      }
    }
    return availablePages;
  }

  getPages() {
    return this.props.project.get('pages')
      .then(this.constructPagesData)
      .then((availablePages) => {
        this.setState({ 
          pages: availablePages, 
          loaded: true,
        });
        return availablePages;
      })
      .then((availablePages) => {
        if (availablePages.find(page => page.slug === 'team')) {
          this.getTeam();
        }
      })
      .catch((error) => console.error('Error retrieving project pages', error));
  }

  getTeam() {
    return this.props.project.get('project_roles')
      .then(projectRoles => {
        const userIds = projectRoles.map(role => role.links.owner.id);
        return apiClient.type('users').get(userIds)
          .then(users => this.constructTeamData(projectRoles, users))
          .catch((error) => console.error('Error retrieving project team users', error));
      })
      .then(team => this.setState({ team }))
      .catch((error) => console.error('Error retrieving project team data', error));
  }

  constructTeamData(roles, users) {
    return users.map(user => {
      return {
        userResource: user,
        roles: roles.find(role => user.id === role.links.owner.id).roles,
      };
    });
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
        <AboutNav pages={pages} projectPath={`/projects/${project.slug}`} />
        {React.cloneElement(children, {project, pages, team})}
      </div>
    )
  }
}

export default AboutProject;
