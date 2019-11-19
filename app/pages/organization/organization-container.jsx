import PropTypes from 'prop-types';
import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import Translate from 'react-translate-component';
import isAdmin from '../../lib/is-admin';
import OrganizationPage from './organization-page';

class OrganizationContainer extends React.Component {
  constructor() {
    super();

    this.state = {
      collaboratorView: true,
      error: null,
      errorFetchingProjects: null,
      fetchingOrganization: false,
      fetchingProjects: false,
      fetchingProjectAvatars: false,
      organization: null,
      organizationAvatar: {},
      organizationBackground: {},
      organizationRoles: [],
      organizationPages: [],
      organizationProjects: [],
      projectAvatars: [],
      quoteObject: {}
    };

    this.toggleCollaboratorView = this.toggleCollaboratorView.bind(this);
    this.updateQuery = this.updateQuery.bind(this);
  }

  componentDidMount() {
    const { initialLoadComplete } = this.context;
    const { params } = this.props;

    if (initialLoadComplete) {
      this.fetchOrganization(params.name, params.owner);
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { user } = this.context;
    const { location, params } = this.props;
    const { collaboratorView, fetchingOrganization, organization } = this.state;

    const noOrgAfterLoad = nextContext.initialLoadComplete && organization === null;

    if (nextProps.params.name !== params.name
      || nextProps.params.owner !== params.owner
      || nextContext.user !== user
      || noOrgAfterLoad) {
      if (!fetchingOrganization) {
        this.fetchOrganization(nextProps.params.name, nextProps.params.owner);
      }
    }

    if (organization && (nextProps.location.query !== location.query)) {
      this.fetchProjects(
        organization,
        ((isAdmin() || this.isCollaborator()) && collaboratorView),
        nextProps.location.query
      );
    }
  }

  isCollaborator() {
    const { user } = this.context;
    const { organizationRoles } = this.state;

    if (!user) {
      return false;
    }

    const collaboratorRoles = organizationRoles
      .filter(role => role.roles.includes('collaborator') || role.roles.includes('owner'));
    return collaboratorRoles.some(role => role.links.owner.id === user.id);
  }

  toggleCollaboratorView() {
    const { collaboratorView, organization } = this.state;

    const newView = !collaboratorView;
    this.setState({ collaboratorView: newView });
    this.fetchProjects(organization, newView);
  }

  updateQuery(newParams) {
    const { router } = this.context;
    const { location } = this.props;

    const query = Object.assign({}, location.query, newParams);
    const results = [];
    Object.keys(query).forEach((key) => {
      if (query[key] === '') {
        results.push(delete query[key]);
      }
    });
    const newLocation = Object.assign({}, location, { query });
    newLocation.search = '';
    router.push(newLocation);
  }

  fetchResearcherQuote() {
    const { organizationProjects, projectAvatars } = this.state;

    const quotableProjects = organizationProjects
      .filter(project => project.researcher_quote);
    const project = quotableProjects[Math.floor(Math.random() * quotableProjects.length)];
    if (project && project.configuration && project.configuration.researcherID) {
      if (project.configuration.researcherID === project.display_name) {
        const projectAvatar = projectAvatars.find(avatar => avatar.links.linked.id === project.id);
        if (projectAvatar && projectAvatar.src) {
          this.setState({
            quoteObject: {
              displayName: project.display_name,
              quote: project.researcher_quote,
              researcherAvatar: projectAvatar.src,
              slug: project.slug
            }
          });
        }
      } else {
        apiClient.type('users').get(project.configuration.researcherID)
          .then((researcher) => {
            researcher.get('avatar').then(([avatar]) => {
              if (avatar.src) {
                this.setState({
                  quoteObject: {
                    displayName: project.display_name,
                    quote: project.researcher_quote,
                    researcherAvatar: avatar.src,
                    slug: project.slug
                  }
                });
              }
            });
          })
          .catch(error => console.error(error)); // eslint-disable-line no-console
      }
    }
  }

  fetchProjects(organization, collaboratorView, locationQuery = this.props.location.query) {
    this.setState({ errorFetchingProjects: null, fetchingProjects: true, fetchingProjectAvatars: true });
    const query = {
      include: 'avatar',
      launch_approved: true,
      private: false,
      sort: '-launch_date',
      state: 'live'
    };

    if (collaboratorView) {
      delete query.launch_approved;
      delete query.private;
      delete query.state;
    }
    if (locationQuery && locationQuery.category) {
      query.tags = locationQuery.category;
    }

    organization.get('projects', query)
      .then((organizationProjects) => {
        this.setState({ fetchingProjects: false, organizationProjects });
        const avatarRequests = organizationProjects
          .filter(project => project.links.avatar && project.links.avatar.id)
          .map(project => apiClient.type('avatars').get(project.links.avatar.id)
            .catch((error) => {
              if (error.status !== 404) {
                console.error('error loading project avatar', error); // eslint-disable-line no-console
              }
            }));
        Promise.all(avatarRequests)
          .then((projectAvatars) => {
            this.setState({ fetchingProjectAvatars: false, projectAvatars });
            this.fetchResearcherQuote();
          })
          .catch((error) => {
            console.error('error loading project avatars', error); // eslint-disable-line no-console
            this.setState({ fetchingProjectAvatars: false });
          });
      })
      .catch((error) => {
        console.error('error loading projects', error); // eslint-disable-line no-console
        this.setState({ errorFetchingProjects: error, fetchingProjects: false });
      });
  }

  fetchAllOrganizationRoles(organization, organizationRoles = [], _page = 1) {
    return apiClient.type('organization_roles')
      .get({ organization_id: organization.id, page: _page })
      .then((orgRoles) => {
        const meta = orgRoles[0].getMeta();
        const newOrgRoles = organizationRoles.concat(orgRoles);
        if (meta.next_page) {
          this.fetchAllOrganizationRoles(organization, newOrgRoles, meta.next_page);
        }
        return newOrgRoles;
      })
      .catch(error => console.error('error loading roles', error)); // eslint-disable-line no-console
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
          const awaitRoles = this.fetchAllOrganizationRoles(organization);
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
              this.fetchProjects(organization, (isAdmin() || this.isCollaborator()));
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
    const { location, params } = this.props;
    const {
      collaboratorView,
      error,
      errorFetchingProjects,
      fetchingOrganization,
      fetchingProjects,
      organization,
      organizationAvatar,
      organizationBackground,
      organizationPages,
      organizationProjects,
      projectAvatars,
      quoteObject
    } = this.state;

    if (organization && (organization.listed || isAdmin() || this.isCollaborator())) {
      return (
        <OrganizationPage
          category={location && location.query && location.query.category}
          collaborator={isAdmin() || this.isCollaborator()}
          collaboratorView={collaboratorView}
          errorFetchingProjects={errorFetchingProjects}
          fetchingProjects={fetchingProjects}
          onChangeQuery={this.updateQuery}
          organization={organization}
          organizationAvatar={organizationAvatar}
          organizationBackground={organizationBackground}
          organizationPages={organizationPages}
          organizationProjects={organizationProjects}
          projectAvatars={projectAvatars}
          quoteObject={quoteObject}
          toggleCollaboratorView={this.toggleCollaboratorView}
        />
      );
    } else if (fetchingOrganization) {
      return (
        <div className="content-container">
          <p>
            <Translate content="organization.loading" />
            <strong>{params.name}</strong>
            ...
          </p>
        </div>
      );
    } else if (error) {
      return (
        <div className="content-container">
          <p>
            <Translate content="organization.error" />
            <strong>{params.name}</strong>
            .
          </p>
          <p>
            <code>{error.toString()}</code>
          </p>
        </div>
      );
    } else if (organization === undefined || (organization && !organization.listed)) {
      return (
        <div className="content-container">
          <p>
            <strong>{params.name}</strong>
            <Translate content="organization.notFound" with={{ title: params.name }} />
          </p>
          <p>
            <Translate content="organization.notPermission" />
          </p>
        </div>
      );
    } else {
      return (
        <div className="content-container">
          <p><Translate content="organization.pleaseWait" /></p>
        </div>
      );
    }
  }
}

OrganizationContainer.contextTypes = {
  initialLoadComplete: PropTypes.bool,
  router: PropTypes.object.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string
  })
};

OrganizationContainer.propTypes = {
  location: PropTypes.shape({
    query: PropTypes.shape({
      category: PropTypes.string
    })
  }),
  params: PropTypes.shape({
    name: PropTypes.string,
    owner: PropTypes.string
  }).isRequired
};

export default OrganizationContainer;
