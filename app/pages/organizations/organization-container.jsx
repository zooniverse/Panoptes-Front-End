import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import isAdmin from '../../lib/is-admin';

class OrganizationContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      fetching: false,
      fetchingAvatars: [],
      organization: null,
      organizationAvatar: {},
      organizationBackground: {}
    };

    this.fetchProjects = this.fetchProjects.bind(this);
    this.fetchOrganization = this.fetchOrganization.bind(this);
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

  fetchAllProjects(organization) {
    if (organization.links.projects) {
      const projectIds = organization.links.projects;

      organization.get('projects', { include: 'avatar' })
        .then(projects =>
          projectIds.map((projectId) => {
            const project = projects.find(p => p.id === projectId);
            if (project) {
              const projectWithAvatar = project;
              let fetchingAvatars = this.state.fetchingAvatars;
              fetchingAvatars.push(project.id);
              this.setState({ fetchingAvatars });
              project.get('avatar')
                .then((avatar) => {
                  projectWithAvatar.avatar_src = avatar.src.slice(7);
                  fetchingAvatars = this.state.fetchingAvatars;
                  const index = fetchingAvatars.indexOf(project.id);
                  fetchingAvatars.splice(index, 1);
                  this.setState({ fetchingAvatars });
                });
              return projectWithAvatar;
            }
            return {
              description: 'Unknown project',
              display_name: `Project ${projectId}`,
              id: projectId,
              links: {
                owner: {
                  display_name: 'CHECK WITH OTHER ORG COLLABORATORS'
                }
              }
            };
          })
        )
        .then((allProjects) => {
          const org = this.state.organization;
          org.projects = allProjects;
          this.setState({ organization: org, fetching: false });
        })
        .catch((error) => {
          console.error('error loading projects', error); // eslint-disable-line no-console
          this.setState({ fetching: false });
        });
    }
  }

  fetchLaunchedProjects(organization) {
    organization.get('projects', { cards: true, launch_approved: true })
      .catch((error) => {
        console.error('error loading projects', error); // eslint-disable-line no-console
        this.setState({ fetching: false });
      })
      .then((projects) => {
        const org = this.state.organization;
        org.projects = projects;
        this.setState({ organization: org, fetching: false });
      });
  }

  isCollaborator(organization) {
    organization.get('organization_roles')
      .then((roles) => {
        const collaboratorRoles = roles.filter(role =>
          role.roles.includes('collaborator') || role.roles.includes('owner'));
        return collaboratorRoles.some(role => role.links.owner.id === this.context.user.id);
      })
      .catch((error) => {
        console.error('error loading collaborators', error); // eslint-disable-line no-console
      });
  }

  fetchOrganization(name, owner) {
    if (!name || !owner) {
      return;
    }

    const slug = `${owner}/${name}`;

    this.setState({ fetching: true, error: null });

    apiClient.type('organizations').get({ slug, include: ['avatar', 'background'] })
      .catch((error) => {
        console.error('error loading organization', error); // eslint-disable-line no-console
        this.setState({ fetching: false, error });
      })
      .then(([organization]) => {
        organization.projects = []; // eslint-disable-line no-param-reassign
        this.setState({ organization });

        if (organization) {
          apiClient.type('avatars')
            .get(organization.links.avatar.id)
            .catch(error => console.error('error loading avatar', error)) // eslint-disable-line no-console
            .then((organizationAvatar) => {
              this.setState({ organizationAvatar });
            });
        }

        if (organization) {
          apiClient.type('backgrounds')
            .get(organization.links.background.id)
            .catch(error => console.error('error loading background image', error)) // eslint-disable-line no-console
            .then((organizationBackground) => {
              this.setState({ organizationBackground });
            });
        }

        this.fetchProjects(organization);
      });
  }

  fetchProjects(organization) {
    if (isAdmin()) {
      this.fetchAllProjects(organization);
    } else if (this.props.location.query.view === 'collaborator') {
      const collaboratorStatus = Promise.resolve(this.isCollaborator(organization))
        .catch(error => console.error('error loading collaborators', error)) // eslint-disable-line no-console
        .then(status => status);
      if (collaboratorStatus) {
        this.fetchAllProjects(organization);
      }
    } else {
      this.fetchLaunchedProjects(organization);
    }
  }

  render() {
    if (this.state.organization) {
      return React.Children.map(this.props.children, child =>
        React.cloneElement(child, {
          organization: this.state.organization,
          organizationAvatar: this.state.organizationAvatar,
          organizationBackground: this.state.organizationBackground
        })
      )[0];
    } else if (this.state.fetching) {
      return (
        <div className="content-container">
          <p>
            Loading{' '}
            <strong>Organization #{this.props.params.name}</strong>...
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
  children: React.PropTypes.node.isRequired,
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
