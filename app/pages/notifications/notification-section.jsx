import React from 'react';
import Notification from './notification';
import apiClient from 'panoptes-client/lib/api-client';

const NotificationSection = React.createClass({

  propTypes: {
    notifications: React.PropTypes.array,
  },

  componentWillMount() {
    return apiClient.type('projects').get({id: this.props.projectID, cards: true})
    .catch(() => {
      return null;
    })
    .then(([project]) => {
      this.setState({
        project: project
      });
    });
  },

  render() {
    console.log(this.props);
    console.log(this.state);
    return (
      <div className="notification-section">
        <p> test </p>
      </div>
    );
  },
});

export default NotificationSection;
