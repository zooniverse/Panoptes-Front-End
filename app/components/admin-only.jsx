import counterpart from 'counterpart';
import React from 'react';
import PropTypes from 'prop-types';
import apiClient from 'panoptes-client/lib/api-client';
import isAdmin from '../lib/is-admin';

class AdminOnly extends React.Component {
  static contextTypes = {
    user: PropTypes.object
  };

  static defaultProps = {
    whenActive: false
  };

  refreshing = false

  componentDidMount() {
    apiClient.listen('change', this.handleClientChange);
  }

  componentWillUnmount() {
    apiClient.stopListening('change', this.handleClientChange);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.refreshing) {
      this.refreshing = false;
      this.forceUpdate();
    }
  }

  handleClientChange = () => {
    if (!this.refreshing) {
      this.refreshing = true;
      // Debounce just a bit.
      setTimeout(() => {
        this.forceUpdate();
      }, 100);
    }
  };

  render() {
    React.Children.only(this.props.children);
    if (!!this.context.user && this.context.user.admin && (!this.props.whenActive || isAdmin())) {
      if (this.refreshing) {
        // Return null during refresh force re-render the child.
        return null;
      } else {
        return this.props.children;
      }
    } else {
      return null;
    }
  }
}

export default AdminOnly;
