import React from 'react';
import Notification from './notification';
import apiClient from 'panoptes-client/lib/api-client';
import talkClient from 'panoptes-client/lib/talk-client';
import { Link } from 'react-router';
import Paginator from '../../talk/lib/paginator';

const NotificationSection = React.createClass({

  propTypes: {
    notifications: React.PropTypes.array,
    params: React.PropTypes.object,
    project: React.PropTypes.object,
    projectID: React.PropTypes.string,
  },

  getDefaultProps() {
    return {
      location: {query: {page: 1}}
    };
  },

  getInitialState() {
    return {
      expanded: false,
      messageLength: 3,
    };
  },

  componentWillMount() {
    if (this.props.projectID === '') {
      this.setZooniverse();
    } else {
      return apiClient.type('projects').get({ id: this.props.projectID, cards: true })
      .catch(() => {
        return null;
      })
      .then(([project]) => {
        this.setState({
          slug: project.slug,
          name: project.display_name,
          avatar: project.avatar_src
        });
      });
    }
  },

  componentDidMount() {
    const sectionTitle = this.props.projectID.length ? 'section-' + this.props.projectID : 'section-zooniverse';
    const expandDiv = document.getElementById(sectionTitle);
    expandDiv.addEventListener('click', this.setState.bind(this, { expanded: true }));
  },

  setZooniverse() {
    this.setState({
      name: 'Zooniverse'
    })
  },

  avatarFor() {
    const src = this.state.avatar ? '//' + this.state.avatar : '/assets/simple-avatar.jpg';
    return <img src={src} className="notification-section__img" alt="Project Avatar" />
  },

  renderHeader() {
    const sectionTitle = this.props.projectID.length ? 'section-' + this.props.projectID : 'section-zooniverse';

    return (
      <div id={this.state.expanded ? '' : sectionTitle}>
        <button className="secret-button notification-section__close" title="Remove choice" onClick={this.setState.bind(this, {expanded: !this.state.expanded})}>
          <i className="fa fa-times"></i>
        </button>

        <div className="notification-section__header">

          <div className="notification-section__item">
            {this.avatarFor()}
          </div>

          <div className="notification-section__item">
            <Link to={'/projects/' + this.state.slug} className="notification-section__title">
              <h4 className="notification-section__title">{this.state.name}</h4>
            </Link>
          </div>

        </div>
      </div>
    );
  },

  render() {
    console.log(this.props);
    const notificationLength = Math.min(this.props.notifications.length, this.state.messageLength);
    const shownNotifications = this.props.notifications.slice(0, notificationLength);

    return (
      <div className="notification-section">

        {this.renderHeader()}

        {this.state.expanded && (
          shownNotifications.map((notification) => {
            return (
              <Notification
                notification={notification}
                key={notification.id}
                user={this.props.user}
                project={this.props.project}
                params={this.props.params}
              />);
          })
        )}

        {this.state.expanded && (
            <div className="centering">
              <Paginator
                className="older"
                scrollOnChange={false}
                firstAndLast={false}
                pageSelector={false}
                nextLabel={<span>Load more <i className="fa fa-long-arrow-down" /></span>} />
            </div>
        )}

      </div>
    );
  },
});

export default NotificationSection;
