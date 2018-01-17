import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router';
import apiClient from 'panoptes-client/lib/api-client';
import uniq from 'lodash/uniq';
import moment from 'moment';
import LoadingIndicator from '../../../components/loading-indicator';

class VersionList extends Component {
  constructor(props) {
    super(props);
    this.getVersions = this.getVersions.bind(this);
    this.renderVersions = this.renderVersions.bind(this);
    this.createVersionString = this.createVersionString.bind(this);
    this.state = {
      loading: false,
      users: null,
      versions: null,
    };
  }

  componentDidMount() {
    this.getVersions();
  }

  componentDidUpdate(prevProps) {
    if (this.props.project !== prevProps.project) {
      this.getVersions();
    }
  }

  render() {
    const { loading, versions, users } = this.state;
    return (this.props.project && !loading && versions && users) ? this.renderVersions() : <LoadingIndicator />;
  }

  createVersionString(version) {
    const versionAuthor = this.state.users.find(user => user.id === version.whodunnit);
    const [property] = Object.keys(version.changeset);
    const [oldValue, newValue] = version.changeset[property];    
    const time = moment(version.created_at).fromNow();

    // There are some versions that have no `whodunnit` property, so set a fallback. 
    // It was probably a ghost.
    const versionAuthorName = (versionAuthor) ? versionAuthor.display_name : '👻 SOMEONE 👻';
    const versionEntry = [versionAuthorName, 'changed', property];
    if (oldValue !== null && oldValue !== undefined) {
      versionEntry.push('from', oldValue);
    }
    versionEntry.push('to', newValue, time);
    return versionEntry.join(' ');
  }

  getVersions() {
    if (!this.props.project) {
      return false;
    }

    this.setState({ loading: true });
    return this.props.project.get('versions')
      .then(versions => {
        const userIds = uniq(versions.map(version => version.whodunnit));
        return apiClient.type('users').get(userIds)
          .then(users => ({ versions, users }))
          .catch(error => console.error('Error retrieving version author data', error));
      })
      .then(({ versions, users }) => {
        this.setState({
          loading: false,
          versions: versions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
          users,
        });
      })
      .catch(error => console.error('Error retrieving version data', error));
  }

  renderVersions() {
    return (
      <div>
        <h4>Recent Status Changes</h4>
        <ul className="project-status__section-list">
          {this.state.versions.map(version =>
            <li key={version.id}>{this.createVersionString(version)}</li>
          )}
        </ul>
      </div>
    );
  }
}

VersionList.propTypes = {
  project: PropTypes.object.isRequired
};

export default VersionList;