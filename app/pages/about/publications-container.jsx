import apiClient from 'panoptes-client/lib/api-client';
import counterpart from 'counterpart';
import Publications from './publications';
import PublicationsList from '../../lib/publications';
import React from 'react';

const sectionOrder = [
  'space',
  'physics',
  'climate',
  'humanities',
  'nature',
  'medicine',
  'meta',
];

counterpart.registerTranslations('en', {
  publications: {
    nav: {
      showAll: 'Show All',
      space: 'Space',
      physics: 'Physics',
      climate: 'Climate',
      humanities: 'Humanities',
      nature: 'Nature',
      medicine: 'Medicine',
      meta: 'Meta',
    },
    content: {
      header: {
        showAll: 'All Publications'
      }
    }
  }
});

class PublicationsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.formatProjectData = this.formatProjectData.bind(this);
    this.loadProjectData = this.loadProjectData.bind(this);
    this.generateNavItems = this.generateNavItems.bind(this);
    this.generateVisibleProjectList = this.generateVisibleProjectList.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.loadProjectData();
    this.state = {
      filter: 'showAll',
      loading: false,
      projects: {}
    };
  }

  componentDidMount() {
    document.documentElement.classList.add('on-secondary-page');
  }

  componentWillUnmount() {
    document.documentElement.classList.remove('on-secondary-page');
  }

  render() {
    const showAll = this.state.filter === 'showAll';
    const projects = this.generateVisibleProjectList(showAll);
    const navItems = this.generateNavItems();
    const titleKey = (showAll)
      ? 'publications.content.header.showAll'
      : `publications.nav.${this.state.filter}`;

    return (
      <Publications
        showAll={showAll}
        projects={projects}
        navItems={navItems}
        setFilter={this.setFilter}
        title={counterpart(titleKey)}
      />
    );
  }

  loadProjectData() {
    this.setState({ loading: true });

    const projectSlugs = Object.keys(PublicationsList).reduce((slugs, sectionKey) => {
      const sectionSlugs = PublicationsList[sectionKey].map(item => item.slug);
      return slugs.concat(sectionSlugs);
    }, []);

    apiClient.type('projects')
      .get({
        slug: projectSlugs,
        cards: true
      })
      .then(this.formatProjectData)
      .then((formattedData) => {
        this.setState({
          loading: false,
          projects: formattedData
        });
      })
      .catch((error) => console.info(error));
  }

  formatProjectData(projectResources) {
    // Create a list of project data to the following schema, using the publications list and project resources:
    // [
    //   {
    //     id: 'climate',
    //     sectionTitle: 'Climate',
    //     projects: [
    //       {
    //         avatar_src: ''
    //         name: ''
    //         publications: [
    //           ...from publications.js
    //         ]
    //       }
    //       ...
    //     ]
    //   }
    // ]
    return Object.keys(PublicationsList).reduce((projectList, section) => {
      projectList[section] = PublicationsList[section].reduce((projectsInSection, project) => {
        const projectResource = projectResources.find(resource => project.slug === resource.slug);
        projectsInSection.push({
          avatar_src: (projectResource) ? projectResource.avatar_src : false,
          name: project.name || projectResource.display_name,
          publications: project.publications
        });
        return projectsInSection;
      }, []);
      return projectList;
    }, {});
  }

  generateNavItems() {
    const sideBarNav = Object.keys(counterpart('publications.nav'));
    return sideBarNav.map(item => ({
      id: item,
      content: counterpart(`publications.nav.${item}`),
      active: this.state.filter === item,
    }));
  }

  generateVisibleProjectList(showAll) {
    if (showAll) {
      return sectionOrder.reduce((list, sectionId) =>
        list.concat(this.state.projects[sectionId]), []);
    } else {
      return this.state.projects[this.state.filter];
    }
  }

  setFilter(id) {
    this.setState({ filter: id });
  }
}

export default PublicationsContainer;
