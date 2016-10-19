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
      location: { query: { page: 1 } },
      section: null
    };
  },

  getInitialState() {
    return {
      expanded: false,
      shownMessages: 3,
    };
  },

  componentWillMount() {
    if (this.props.section === 'zooniverse') {
      this.setState({
        name: 'Zooniverse',
      });
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
    this.getUnreadCount();
    const sectionTitle = this.props.projectID.length ? this.props.section : 'project-zooniverse';
    const expandDiv = document.getElementById(sectionTitle);
    expandDiv.addEventListener('click', this.setState.bind(this, { expanded: true }, null));
  },

  getUnreadCount() {
    return talkClient.type('notifications').get({page: 1, page_size: 1, delivered: false, section: this.props.section })
    .catch(() => {
      return null;
    })
    .then(([project]) => {
      if (project) {
        console.log(project);
        const count = project.getMeta().count || 0;
        console.log(count);
        this.setState({ unread: count });
      } else {
        this.setState({ unread: 0 });
      }
    });
  },

  avatarFor() {
    console.log(this.state);
    const src = this.state.avatar ? '//' + this.state.avatar : '/assets/simple-avatar.jpg';
    if (this.state.unread > 0) {
      return this.unreadCircle();
    } else {
      return <img src={src} className="notification-section__img" alt="Project Avatar" />;
    }
  },

  unreadCircle() {
    return (
      <svg className="notification-section__img" xmlns="http://www.w3.org/2000/svg">
        <circle cx="0" cy="0" r="100" fill="#E45950">
          <title>
            {(this.state.unread + " Unread Notification(s)")}
          </title>
        </circle>
        <text x="40%" y="50%" stroke="white" stroke-width="2px" dy=".3em">{this.state.unread}</text>
      </svg>
    );
  },

  renderHeader() {
    const sectionTitle = this.props.projectID.length ? this.props.section : 'project-zooniverse';
    const buttonType = this.state.expanded ? 'fa fa-times' : 'fa fa-chevron-down'

    return (
      <div id={this.state.expanded ? '' : sectionTitle}>
        <button className="secret-button notification-section__toggle" title="Remove choice" onClick={this.setState.bind(this, {expanded: !this.state.expanded}, null)}>
          <i className={buttonType}></i>
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
    const notificationLength = Math.min(this.props.notifications.length, this.state.shownMessages);
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
