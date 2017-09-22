import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import isAdmin from '../../lib/is-admin';
import OrganizationPage from './organization-page';

class OrganizationContainer extends React.Component {
  constructor() {
    super();

    this.state = {
      collaboratorView: false,
      error: null,
      errorFetchingProjects: null,
      fetchingOrganization: false,
      fetchingProjects: false,
      organization: null,
      organizationAvatar: {},
      organizationBackground: {},
      organizationRoles: [],
      organizationPages: [],
      organizationProjects: [],
      view: false
    };

    this.toggleCollaboratorView = this.toggleCollaboratorView.bind(this);
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
      if (!this.state.fetchingOrganization) {
        this.fetchOrganization(nextProps.params.name, nextProps.params.owner);
      }
    }
  }

  isCollaborator() {
    if (!this.context.user) {
      return false;
    }

    const collaboratorRoles = this.state.organizationRoles.filter(role =>
      role.roles.includes('collaborator') || role.roles.includes('owner'));
    return collaboratorRoles.some(role => role.links.owner.id === this.context.user.id);
  }

  checkView() {
    if (this.state.organization && this.state.organization.listed) {
      return true;
    } else if (isAdmin()) {
      return true;
    } else {
      return this.isCollaborator();
    }
  }

  toggleCollaboratorView() {
    const newView = !this.state.collaboratorView;
    this.setState({ collaboratorView: newView });
    this.fetchProjects(this.state.organization, newView);
  }

  fetchProjects(organization, collaboratorView = false) {
    this.setState({ errorFetchingProjects: null, fetchingProjects: true });

    const query = { cards: true };
    if (!collaboratorView) {
      query.launch_approved = true;
    }
    organization.get('projects', query)
      .then(organizationProjects => this.setState({ fetchingProjects: false, organizationProjects }))
      .catch((error) => {
        console.error('error loading projects', error); // eslint-disable-line no-console
        this.setState({ errorFetchingProjects: error, fetchingProjects: false });
      });
  }

  fetchOrganization(name, owner) {
    if (!name || !owner) {
      return;
    }

    this.setState({ fetchingOrganization: true, error: null });

    const slug = `${owner}/${name}`;

    apiClient.type('organizations').get({ slug, include: 'avatar,background,organization_roles,pages' })
      .then(([organization]) => {
        this.setState({ organization });

        if (organization) {
          const awaitAvatar = apiClient.type('avatars').get(organization.links.avatar.id)
            .catch(error => console.error('error loading avatar', error)); // eslint-disable-line no-console
          const awaitBackground = apiClient.type('backgrounds').get(organization.links.background.id)
            .catch(error => console.error('error loading background', error)); // eslint-disable-line no-console
          const awaitRoles = apiClient.type('organization_roles').get(organization.links.organization_roles)
            .catch(error => console.error('error loading roles', error)); // eslint-disable-line no-console
          const awaitPages = apiClient.type('organization_pages').get(organization.links.pages)
            .catch(error => console.error('error loading pages', error)); // eslint-disable-line no-console

          Promise.all([
            awaitAvatar,
            awaitBackground,
            awaitRoles,
            awaitPages
          ])
            .then(([
              organizationAvatar,
              organizationBackground,
              organizationRoles,
              organizationPages
            ]) => {
              this.setState({
                organizationAvatar,
                organizationBackground,
                organizationRoles,
                organizationPages
              });
              this.fetchProjects(organization);
            })
            .catch((error) => {
              console.error(error); // eslint-disable-line no-console
              this.setState({ error });
            });
        }
      })
      .then(() => this.setState({ fetchingOrganization: false }))
      .catch((error) => {
        console.error('error loading organization', error); // eslint-disable-line no-console
        this.setState({ fetchingOrganization: false, error });
      });
  }

  render() {
    if (this.state.organization && this.checkView()) {
      return (
        <OrganizationPage
          collaborator={isAdmin() || this.isCollaborator()}
          collaboratorView={this.state.collaboratorView}
          errorFetchingProjects={this.state.errorFetchingProjects}
          fetchingProjects={this.state.fetchingProjects}
          organization={this.state.organization}
          organizationAvatar={this.state.organizationAvatar}
          organizationBackground={this.state.organizationBackground}
          organizationPages={this.state.organizationPages}
          organizationProjects={this.state.organizationProjects}
          toggleCollaboratorView={this.toggleCollaboratorView}
        />);
    } else if (this.state.fetchingOrganization) {
      return (
        <div className="content-container">
          <p>
            Loading organization{' '}
            <strong>{this.props.params.name}</strong>...
          </p>
        </div>);
    } else if (this.state.error) {
      return (
        <div className="content-container">
          <p>
            There was an error retrieving organization{' '}
            <strong>{this.props.params.name}</strong>.
          </p>
          {this.state.error &&
            <p>
              <code>{this.state.error.toString()}</code>
            </p>}
        </div>);
    } else if (this.state.organization === undefined || !this.checkView) {
      return (
        <div className="content-container">
          <p>Organization <strong>{this.props.params.name}</strong> not found.</p>
          <p>If you&apos;re sure the URL is correct, you might not have permission to view this project.</p>
        </div>);
    } else {
      return (
        <div className="content-container">
          <p>Please wait...</p>
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
  params: React.PropTypes.shape({
    name: React.PropTypes.string,
    owner: React.PropTypes.string
  }).isRequired
};

export default OrganizationContainer;
