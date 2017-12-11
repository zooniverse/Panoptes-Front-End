import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import counterpart from 'counterpart';
import { connect } from 'react-redux';
import apiClient from 'panoptes-client/lib/api-client';
import AboutNav from './about-nav';

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

  componentDidUpdate(prevProps) {
    const prevTranslations = prevProps.translations.strings.project_page;
    if (prevTranslations !== this.props.translations.strings.project_page) {
      this.setState({
        pages: this.constructPagesData()
      });
    }
  }

  constructPagesData() {
    const availablePages = [];

    for (const url_key in SLUG_MAP) {
      const { pages, translations } = this.props;
      const matchingPage = pages.find(page => page.url_key === url_key);
      const pageTranslations = translations ? translations.strings.project_page : [];
      const [matchingTranslation] = pageTranslations.filter(page => page.translated_id === parseInt(matchingPage.id, 10));
      const { content } = (matchingTranslation && matchingTranslation.strings) ?
        matchingTranslation.strings :
        matchingPage;
      if (content) {
        availablePages.push({
          slug: SLUG_MAP[url_key],
          title: matchingPage.title,
          content
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
        <Helmet title={`${this.props.translation.display_name} » ${counterpart('project.about.header')}`} />
        <AboutNav pages={pages} projectPath={`/projects/${project.slug}`} />
        {React.cloneElement(children, {project, pages, team})}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  translations: state.translations
});

export default connect(mapStateToProps)(AboutProject);
export { AboutProject };
