import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';

class OrganizationContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      fetching: false,
      organization: null,
      organizationAvatar: {},
      organizationBackground: {}
    };

    this.fetchProjects = this.fetchProjects.bind(this);
    this.fetchOrganization = this.fetchOrganization.bind(this);
  }

  componentDidMount() {
    if (this.context.initialLoadComplete) {
      this.fetchOrganization(this.props.params.id);
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const noOrgAfterLoad = nextContext.initialLoadComplete && this.state.organization === null;

    if (nextProps.params.id !== this.props.params.id || noOrgAfterLoad) {
      if (!this.state.fetching) {
        this.fetchOrganization(nextProps.params.id);
      }
    }
  }

  fetchOrganization(id) {
    if (!id) {
      return;
    }

    this.setState({ fetching: true, error: null });

    apiClient.type('organizations').get(id.toString(), { include: ['avatar', 'background'] })
      .catch((error) => {
        console.error('error loading organization', error); // eslint-disable-line no-console
        this.setState({ fetching: false, error });
      })
      .then((organization) => {
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
    organization.get('projects', { cards: true, include: ['avatar'] })
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
            <strong>Organization #{this.props.params.id}</strong>...
          </p>
        </div>);
    } else {
      return (
        <div className="content-container">
          <p>
            There was an error retrieving organization <strong>#{this.props.params.id}</strong>.
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
  children: React.PropTypes.node.isRequired,
  params: React.PropTypes.shape({
    id: React.PropTypes.string
  }).isRequired
};

export default OrganizationContainer;
