import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router';
import apiClient from 'panoptes-client/lib/api-client';

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
    return (
      <li key={resource.id}>
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
        {this.state.resources.length > 0 ? <ul>
          {this.state.resources.map(resource => this.resourceLink(resource))}
        </ul> : <p>None</p>}
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
