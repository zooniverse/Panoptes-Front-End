import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';

class OrganizationContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fetching: false,
      organization: { projects: [] },
      organizationAvatar: {}
    };

    this.fetchProjects = this.fetchProjects.bind(this);
    this.fetchOrganization = this.fetchOrganization.bind(this);
  }

  componentDidMount() {
    document.documentElement.classList.add('on-secondary-page');
  }

  componentWillReceiveProps(nextProps) {
    this.fetchOrganization(nextProps.params.organization_id);
  }

  fetchOrganization(id) {
    if (this.state.fetching) return;

    this.setState({ fetching: true });
    apiClient.type('organizations').get({ id, include: ['avatar'] }).then(([organization]) => {
      organization.projects = []; // eslint-disable-line no-param-reassign
      this.setState({ organization });

      if (organization) {
        apiClient.type('avatars').get(organization.links.avatar.id).catch((error) => []).then((organizationAvatar) => {
          this.setState({ organizationAvatar });
        });
      };

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
      React.cloneElement(child, { organization: this.state.organization, organizationAvatar: this.state.organizationAvatar })
    )[0];
  }

}

OrganizationContainer.propTypes = {
  children: React.PropTypes.node.isRequired
};

export default OrganizationContainer;
