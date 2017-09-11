import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import isAdmin from '../../lib/is-admin';
import OrganizationPage from './organization-page';

class OrganizationContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      collaboratorView: false,
      fetching: false,
      fetchingAvatars: false,
      organization: null,
      organizationAvatar: {},
      organizationBackground: {}
    };
  }

  componentDidMount() {
    if (this.context.initialLoadComplete) {
      this.fetchOrganization(this.props.params.name, this.props.params.owner);
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const noOrgAfterLoad = nextContext.initialLoadComplete && this.state.organization === null;

    if (nextProps.params.name !== this.props.params.name ||
      nextProps.params.owner !== this.props.params.owner ||
      noOrgAfterLoad) {
      if (!this.state.fetching) {
        this.fetchOrganization(nextProps.params.name, nextProps.params.owner);
      }
    }
  }

  isCollaborator(organization) {
    organization.get('organization_roles')
      .then((roles) => {
        const collaboratorRoles = roles.filter(role =>
          role.roles.includes('collaborator') || role.roles.includes('owner'));
        return collaboratorRoles.some(role => role.links.owner.id === this.context.user.id);
      })
      .catch(error => console.error('error loading collaborators', error)); // eslint-disable-line no-console
  }

  buildAllProjects(projects) {
    if (this.state.organization.links.projects) {
      const projectIds = this.state.organization.links.projects;

      return projectIds.map((projectId) => {
        const project = projects.find(p => p.id === projectId);

        if (project) {
          this.setState({ fetchingAvatars: true });

          project.get('avatar')
            .then((avatar) => {
              project.avatar_src = avatar.src.slice(7);
              this.setState({ fetchingAvatars: false });
            })
            .catch((error) => {
              console.error(`error loading project #${project.id} avatar`, error); // eslint-disable-line no-console
              this.setState({ fetchingAvatars: false });
            });

          return project;
        }
        return {
          description: 'Unknown project',
          display_name: `Project #${projectId}`,
          id: projectId,
          links: { owner: { display_name: 'CHECK WITH OTHER ORG COLLABORATORS' }}
        };
      });
    }
    return projects;
  }

  fetchProjects(organization) {
    const query = {};
    if (isAdmin()) {
      query.include = 'avatar';
      this.setState({ collaboratorView: true });
    } else if (this.props.location.query.view === 'collaborator') {
      const collaboratorStatus = Promise.resolve(this.isCollaborator(organization))
        .then(status => status)
        .catch(error => console.error('error loading collaborators', error)); // eslint-disable-line no-console
      if (collaboratorStatus) {
        query.include = 'avatar';
        this.setState({ collaboratorView: true });
      }
    } else {
      query.cards = true;
      query.launch_approved = true;
    }

    organization.get('projects', query)
      .then((projects) => {
        let allProjects;
        if (this.state.collaboratorView) {
          allProjects = this.buildAllProjects(projects);
        } else {
          allProjects = projects;
        }
        const org = this.state.organization;
        org.projects = allProjects;
        this.setState({ organization: org, fetching: false });
      })
      .catch((error) => {
        console.error('error loading projects', error); // eslint-disable-line no-console
        this.setState({ fetching: false });
      });
  }

  fetchOrganization(name, owner) {
    if (!name || !owner) {
      return;
    }

    const slug = `${owner}/${name}`;

    this.setState({ fetching: true, error: null });

    apiClient.type('organizations').get({ slug, include: ['avatar', 'background'] })
      .then(([organization]) => {
        organization.projects = []; // eslint-disable-line no-param-reassign
        this.setState({ organization });

        if (organization) {
          apiClient.type('avatars').get(organization.links.avatar.id)
            .then((organizationAvatar) => {
              this.setState({ organizationAvatar });
            })
            .catch(error => console.error('error loading avatar', error)); // eslint-disable-line no-console
        }

        if (organization) {
          apiClient.type('backgrounds').get(organization.links.background.id)
            .then((organizationBackground) => {
              this.setState({ organizationBackground });
            })
            .catch(error => console.error('error loading background image', error)); // eslint-disable-line no-console
        }

        this.fetchProjects(organization);
      })
      .catch((error) => {
        console.error('error loading organization', error); // eslint-disable-line no-console
        this.setState({ fetching: false, error });
      });
  }

  render() {
    if (this.state.organization) {
      return (
        <OrganizationPage
          collaboratorView={this.state.collaboratorView}
          organization={this.state.organization}
          organizationAvatar={this.state.organizationAvatar}
          organizationBackground={this.state.organizationBackground}
        />
      );
    } else if (this.state.fetching) {
      return (
        <div className="content-container">
          <p>
            Loading{' '}
            <strong>Organization {this.props.params.name}</strong>...
          </p>
        </div>);
    } else {
      return (
        <div className="content-container">
          <p>
            There was an error retrieving organization <strong>#{this.props.params.name}</strong>.
          </p>
          {this.state.error &&
            <p>
              <code>{this.state.error.toString()}</code>
            </p>}
        </div>);
    }
  }

}

OrganizationContainer.contextTypes = {
  initialLoadComplete: React.PropTypes.bool,
  user: React.PropTypes.shape({
    id: React.PropTypes.string
  })
};

OrganizationContainer.propTypes = {
  location: React.PropTypes.shape({
    query: React.PropTypes.shape({
      view: React.PropTypes.string
    })
  }),
  params: React.PropTypes.shape({
    name: React.PropTypes.string,
    owner: React.PropTypes.string
  }).isRequired
};

export default OrganizationContainer;
