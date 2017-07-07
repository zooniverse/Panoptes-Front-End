import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';

class OrganizationContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fetching: false,
      organization: { projects: [] },
      organizationAvatar: {},
      organizationBackground: {},
    };

    this.fetchProjects = this.fetchProjects.bind(this);
    this.fetchOrganization = this.fetchOrganization.bind(this);
  }

  componentDidMount() {
    // this.fetchOrganization(this.props.params.organization_id);
  }

  componentWillReceiveProps(nextProps) {
  //   // if (this.props.params.organization_id !== nextProps.params.organization_id) {
      this.fetchOrganization(nextProps.params.organization_id);
  //   // }
  }

  fetchOrganization(id) {
    if (!id) {
      return;
    }

    this.setState({ fetching: true });
    apiClient.type('organizations').get(id.toString(), { include: ['avatar', 'background'] }).then((organization) => {
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
    organization.get('projects', { cards: true, include: ['avatar'] }).then((projects) => {
      const org = this.state.organization;
      org.projects = projects;
      this.setState({ organization: org, fetching: false });
    });
  }

  render() {
    return React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        organization: this.state.organization,
        organizationAvatar: this.state.organizationAvatar,
        organizationBackground: this.state.organizationBackground
      })
    )[0];
  }

}

OrganizationContainer.propTypes = {
  children: React.PropTypes.node.isRequired,
  params: React.PropTypes.shape({
    organization_id: React.PropTypes.string
  }).isRequired
};

export default OrganizationContainer;
