import React, { Component } from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import moment from 'moment';

import ProjectIcon from '../../components/project-icon';
import LoadingIndicator from '../../components/loading-indicator';

import Toggle from './project-status/toggle';

class OrganizationStatus extends Component {
  constructor(props) {
    super(props);
    this.forceUpdate = this.forceUpdate.bind(this);
    this.renderError = this.renderError.bind(this);

    this.state = {
      organization: null,
      error: null
    };
  }

  componentDidMount() {
    this.getOrganization();
  }

  componentWillUnmount() {
    this.state.organization.stopListening('change', this.forceUpdate);
  }

  getOrganization() {
    const { owner, name } = this.props.params;
    const slug = `${owner}/${name}`;

    return apiClient.type('organizations').get({ slug }).then((organizations) => {
      const organization = organizations[0];
      // TODO: We ought to improve this ChangeListener replacement
      organization.listen('change', this.forceUpdate);
      this.setState({ organization });
      return organization;
    });
  }

  renderError() {
    if (this.state.error) {
      return <div>{this.state.error}</div>;
    }
  }

  render() {
    if (!this.state.organization) {
      return <LoadingIndicator />;
    }

    return (
      <div className="project-status">
        <ProjectIcon project={this.state.organization} />
        <div className="project-status__section">
          <h4>Information</h4>
          <ul>
            <li>Id: {this.state.organization.id}</li>
          </ul>
          <h4>Visibility Settings</h4>
          <ul className="project-status__section-list">
            <li>Listed: <Toggle project={this.state.organization} field="listed" /></li>
            <li>Listed At: {this.state.organization.listed ?
                moment(this.state.organization.listed_at).calendar() : 'N/A'}
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default OrganizationStatus;
