import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import OrganizationPage from './organization-page';

class OrganizationContainer extends React.Component {
  constructor() {
    super();

    this.state = {
      error: null,
      fetching: false,
      organization: null,
      organizationAvatar: {},
      organizationBackground: {},
      organizationPages: [],
      organizationProjects: []
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

  fetchOrganization(name, owner) {
    if (!name || !owner) {
      return;
    }

    const slug = `${owner}/${name}`;

    this.setState({ fetching: true, error: null });

    apiClient.type('organizations').get({ slug, include: 'avatar,background,pages,projects' })
      .then(([organization]) => {
        this.setState({ organization });

        if (organization) {
          const awaitAvatar = apiClient.type('avatars').get(organization.links.avatar.id)
            .catch(error => console.error('error loading avatar', error)); // eslint-disable-line no-console
          const awaitBackground = apiClient.type('backgrounds').get(organization.links.background.id)
            .catch(error => console.error('error loading background', error)); // eslint-disable-line no-console
          const awaitPages = organization.get('pages')
            .catch(error => console.error('error loading pages', error)); // eslint-disable-line no-console
          const awaitProjects = organization.get('projects', { cards: true, launch_approved: true })
            .catch(error => console.error('error loading projects', error)); // eslint-disable-line no-console

          Promise.all([
            awaitAvatar,
            awaitBackground,
            awaitPages,
            awaitProjects
          ])
            .then(([organizationAvatar, organizationBackground, organizationPages, organizationProjects]) => {
              this.setState({ organizationAvatar, organizationBackground, organizationPages, organizationProjects });
            })
            .catch((error) => {
              console.error(error); // eslint-disable-line no-console
              this.setState({ error });
            });
        }
      })
      .then(() => this.setState({ fetching: false }))
      .catch((error) => {
        console.error('error loading organization', error); // eslint-disable-line no-console
        this.setState({ fetching: false, error });
      });
  }

  render() {
    if (this.state.organization) {
      return (
        <OrganizationPage
          organization={this.state.organization}
          organizationAvatar={this.state.organizationAvatar}
          organizationBackground={this.state.organizationBackground}
          organizationPages={this.state.organizationPages}
          organizationProjects={this.state.organizationProjects}
        />
      );
    } else if (this.state.fetching) {
      return (
        <div className="content-container">
          <p>
            Loading organization
            <strong>{this.props.params.name}</strong>...
          </p>
        </div>);
    } else {
      return (
        <div className="content-container">
          <p>
            There was an error retrieving organization <strong>{this.props.params.name}</strong>.
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
  initialLoadComplete: React.PropTypes.bool
};

OrganizationContainer.propTypes = {
  params: React.PropTypes.shape({
    name: React.PropTypes.string,
    owner: React.PropTypes.string
  }).isRequired
};

export default OrganizationContainer;
