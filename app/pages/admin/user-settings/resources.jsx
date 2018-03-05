import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router';
import apiClient from 'panoptes-client/lib/api-client';
import LAB_APP_URL from '../../../lib/lab-app-url';

class Resources extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resources: []
    };
  }

  componentDidMount() {
    this.fetchResources(this.props.type, this.props.user.login);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.user !== this.props.user) {
      this.fetchResources(newProps.type, newProps.user.login);
    }
  }

  fetchResources(type, login) {
    const query = { owner: login };
    if (type === 'projects') {
      query.cards = true;
    }
    return apiClient.type(type).get(query).then(
      resources => this.setState({ resources })
    );
  }

  resourceLink(resource) {
    let labUrl = '/lab';
    if (this.props.type === 'projects') {
      labUrl = `/lab/${resource.id}`;
    } else if (this.props.type === 'organizations') {
      labUrl = `${LAB_APP_URL}/organizations/${resource.id}`;
    }
    return (
      <li key={resource.id}>
        <a href={labUrl}>{resource.id}</a>
        {' - '}
        <Link to={`/${this.props.type}/${resource.slug}`}>
          {resource.display_name}
        </Link>
      </li>
    );
  }

  render() {
    return (
      <div>
        <h3>{this.props.type.charAt(0).toUpperCase() + this.props.type.slice(1)}</h3>
        {this.state.resources.length > 0 ? <div>
          <span>links = &apos;lab - home&apos;</span>
          <ul>
            {this.state.resources.map(resource => this.resourceLink(resource))}
          </ul>
        </div> : <p>None</p>}
      </div>
    );
  }
}

Resources.propTypes = {
  type: PropTypes.string.isRequired,
  user: PropTypes.shape({
    login: PropTypes.string
  }).isRequired
};

export default Resources;
