import React, { Component } from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import LoadingIndicator from '../../components/loading-indicator';
import ProjectIcon from '../../components/project-icon';
import Paginator from '../../talk/lib/paginator';

class OrganizationStatusList extends Component {
  constructor(props) {
    super(props);
    this.getOrganizations = this.getOrganizations.bind(this);
    this.renderOrganizationList = this.renderOrganizationList.bind(this);
    this.renderOrganizationListItem = this.renderOrganizationListItem.bind(this);
    this.state = {
      loading: false,
      organizations: [],
      error: null
    };
  }

  componentDidMount() {
    this.getOrganizations();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.query !== this.props.location.query) {
      this.getOrganizations();
    }
  }

  getOrganizations() {
    const { query } = this.props.location;

    const organizationsQuery = {
      include: ['avatar']
    };

    const mergedQuery = Object.assign({}, organizationsQuery, query);

    this.setState({ loading: true, error: null });
    return apiClient.type('organizations').get(mergedQuery)
      .then((organizations) => { this.setState({ organizations, loading: false }); })
      .catch((error) => { this.setState({ error: `Error requesting organizations:, ${error}`, loading: false }); });
  }

  renderOrganizationList() {
    const { organizations } = this.state;
    let meta = {};
    if (organizations.length > 0) {
      meta = organizations[0].getMeta();
    }

    return (organizations.length === 0) ?
      <div className="project-status-list">No organizations found for this filter</div> :
      <div>
        <div className="project-status-list">
          {organizations.map(organization => this.renderOrganizationListItem(organization))}
        </div>
        <Paginator page={meta.page} pageCount={meta.page_count} />
      </div>;
  }

  renderOrganizationListItem(organization) {
    const [owner, name] = organization.slug.split('/');
    return (
      <div key={organization.id}>
        <ProjectIcon linkTo={`/admin/organization-status/${owner}/${name}`} project={organization} />
      </div>
    );
  }

  render() {
    return (
      <div className="project-status-page">
        {(this.state.error) ? <p>{this.state.error}</p> : null}
        {(this.state.loading) ? <LoadingIndicator /> : this.renderOrganizationList()}
      </div>
    );
  }
}

export default OrganizationStatusList;
