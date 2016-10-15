import React from 'react';
import Notification from './notification';
import apiClient from 'panoptes-client/lib/api-client';
import { Link } from 'react-router';

const NotificationSection = React.createClass({

  propTypes: {
    notifications: React.PropTypes.array,
    params: React.PropTypes.object,
    project: React.PropTypes.object,
    projectID: React.PropTypes.number,
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

  getInitialState() {
    return {
      project: {},
    };
  },

  avatarFor(project) {
    const src = project.avatar_src ? '//' + project.avatar_src : '/assets/simple-avatar.jpg';
    return <img src={src} className="notification-section__img" alt="Project Avatar" />
  },

  render() {
    return (
      <div className="notification-section">

        <button className="secret-button notification-section__close" title="Remove choice" onClick={console.log('clicked')}>
          <i className="fa fa-times" onClick={console.log('test')}></i>
        </button>

        <div className="notification-section__header">

          <div className="notification-section__item">
            {this.avatarFor(this.state.project)}
          </div>

          <div className="notification-section__item">
            <h3 className="notification-section__title">{this.state.project.display_name}</h3>
          </div>

        </div>

        {this.props.notifications.map((notification) => {
          return (
            <Notification
              notification={notification}
              key={notification.id}
              user={this.props.user}
              project={this.props.project}
              params={this.props.params} />);
        })}
      </div>
    );
  },
});

export default NotificationSection;
