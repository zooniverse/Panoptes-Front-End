import PropTypes from 'prop-types';
import React, { Component } from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import talkClient from 'panoptes-client/lib/talk-client';
import { Link } from 'react-router';

import Notification from './notification.cjsx';
import Loading from '../../components/loading-indicator';
import getNotificationData from '../../lib/get-notification-data';
import ZooniverseLogo from '../../partials/zooniverse-logo.cjsx';
import Paginator from '../../talk/lib/paginator.cjsx';

export default class NotificationSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      loading: false,
      name: '',
      notificationData: [],
      project: null
    };
    this.markAllRead = this.markAllRead.bind(this);
    this.markAsRead = this.markAsRead.bind(this);
  }

  componentWillMount() {
    const { projectID, section } = this.props;

    if (section === 'zooniverse') {
      this.setState({
        name: 'Zooniverse'
      });
    } else {
      apiClient.type('projects').get(projectID, { include: 'avatar' })
        .catch((error) => {
          this.setState({ error });
        })
        .then((project) => {
          this.setState({ project });
          if (project.links.avatar) {
            apiClient.type('avatars').get(project.links.avatar.id)
              .then((avatar) => {
                this.setState({
                  name: project.display_name,
                  avatar: avatar.src
                });
              })
              .catch(() => {
                this.setState({
                  name: project.display_name
                });
              });
          } else {
            this.setState({
              name: project.display_name
            });
          }
        });
    }
  }

  componentDidMount() {
    const { expanded, location, notifications } = this.props;
    const page = parseInt(location.query.page, 10) || 1;

    if (expanded) {
      this.fetchNotificationData(notifications, page);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { expanded, location } = this.props;
    const page = parseInt(location.query.page, 10) || 1;
    const nextPage = parseInt(nextProps.location.query.page, 10) || 1;

    if (nextProps.expanded && !expanded) {
      this.fetchNotificationData(nextProps.notifications, nextPage);
    }

    if (nextPage !== page) {
      this.fetchNotificationData(nextProps.notifications, nextPage);
    }
  }

  fetchNotificationData(notifications, page = 1) {
    this.setState({ loading: true });

    const activeNotifications = notifications.slice((page - 1) * 5, page * 5);

    getNotificationData(activeNotifications)
      .then((notificationData) => {
        this.setState({ notificationData, loading: false });
      });
  }

  markAllRead() {
    const { notificationsCounter } = this.context;
    const { section, toggleSection } = this.props;
    const { notificationData } = this.state;

    const requestSection = section === 'zooniverse' ? 'zooniverse' : `project-${section}`;

    notificationData.forEach((data) => {
      data.notification.update({ delivered: true });
    });
    return talkClient
      .put('/notifications/read', { section: requestSection })
      .then(() => talkClient
        .type('notifications')
        .get({ page_size: 1, delivered: false })
        .then(([notification]) => {
          const count = notification ? notification.getMeta().count : 0;
          if (count === 0) notificationsCounter.setUnread(0);
          toggleSection(false);
        }));
  }

  markAsRead(readNotification) {
    const { notificationsCounter } = this.context;
    const { notifications, user } = this.props;
    const relatedNotifications = notifications.filter((notification) => (
      notification.delivered === false
        && (notification.id === readNotification.id
          || notification.source.discussion_id === readNotification.source.discussion_id)
    ));
    const notificationPromises = relatedNotifications
      .map((relatedNotification) => relatedNotification
        .update({ delivered: true })
        .save()
        .catch((error) => {
          console.warn(error);
          return {};
        }));
    Promise.all(notificationPromises).then(() => notificationsCounter.update(user));
  }

  avatarFor(unread) {
    const { slug } = this.props;
    const { avatar, name } = this.state;

    const src = avatar || '/assets/simple-avatar.jpg';
    let sectionAvatar;

    if (unread > 0) return this.unreadCircle(unread);

    if (name === 'Zooniverse') {
      sectionAvatar = <ZooniverseLogo title="Zooniverse Logo" width="40" height="40" />;
    } else {
      sectionAvatar = <img src={src} className="notification-section__img" alt="Project Avatar" />;
    }
    return (
      <Link to={slug ? `/projects/${slug}` : '/'}>
        {sectionAvatar}
      </Link>
    );
  }

  unreadCircle(unread) {
    let centerNum = '40%';

    if (unread > 99) {
      centerNum = '20%';
    } else if (unread > 9) {
      centerNum = '30%';
    }
    const unreadNotifications = unread > 99 ? '99+' : unread;

    return (
      <svg className="notification-section__img">
        <circle cx="0" cy="0" r="100" fill="#E45950">
          <title>
            {`${unread} Unread Notification(s)`}
          </title>
        </circle>
        <text x={centerNum} y="50%" stroke="white" strokeWidth="2px" dy=".3em">{unreadNotifications}</text>
      </svg>
    );
  }

  renderHeader(unread) {
    const { expanded, toggleSection } = this.props;
    const { name } = this.state;

    const buttonType = expanded ? 'fa fa-chevron-up fa-lg' : 'fa fa-chevron-down fa-lg';

    return (
      <div onClick={toggleSection}>
        <div className="notification-section__container">
          <div className="notification-section__item">
            {this.avatarFor(unread)}
          </div>

          <div className="notification-section__item">
            <h3 className="notification-section__title">{name}</h3>
          </div>

          <div className="notification-section__item">
            <button className="notification-section__expand" title="Toggle Section" type="button">
              <i className={buttonType} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {
      expanded, location, notifications, user
    } = this.props;
    const {
      error, loading, notificationData, project
    } = this.state;

    const unread = notifications.filter((notification) => notification.delivered === false).length;

    const page = parseInt(location.query.page, 10) || 1;
    const pageCount = Math.ceil(notifications.length / 5);
    const firstNotification = (page - 1) * 5 + 1;
    const lastNotification = Math.min(page * 5, notifications.length);

    return (
      <div className="notification-section">

        {this.renderHeader(unread)}

        {!!error && (
          <div className="notification-section__error">
            {error.toString()}
          </div>
        )}

        {loading && (
          <span className="notification-section__container">
            <Loading />
          </span>
        )}

        {(expanded && unread > 0) && (
          <button
            onClick={this.markAllRead}
            type="button"
          >
            Mark All Read
          </button>
        )}

        {(expanded && !loading) && (
          notificationData.map((item) => {
            if (item.notification) {
              return (
                <Notification
                  key={item.notification.id}
                  data={item.data}
                  markAsRead={this.markAsRead}
                  notification={item.notification}
                  project={project}
                  user={user}
                />
              );
            }
            return (
              <div className="talk-module notification-section__error">
                {item.error}
              </div>
            );
          })
        )}

        {(expanded) && (
          <div className="centering">
            <Paginator
              className="notification-section__container"
              firstAndLast={false}
              itemCount={true}
              nextLabel={(
                <span>
                  {' older'}
                  <i className="fa fa-chevron-right" />
                </span>
              )}
              page={page}
              pageCount={pageCount}
              pageSelector={false}
              previousLabel={(
                <span>
                  <i className="fa fa-chevron-left" />
                  {' previous'}
                </span>
              )}
              totalItems={(
                <span className="notification-section__item-count">
                  {`${firstNotification} - ${lastNotification} of ${notifications.length}`}
                </span>
              )}
            />
          </div>
        )}

      </div>
    );
  }
}

NotificationSection.propTypes = {
  expanded: PropTypes.bool,
  location: PropTypes.shape({
    query: PropTypes.shape({
      page: PropTypes.string
    })
  }),
  notifications: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string
  })),
  projectID: PropTypes.string,
  section: PropTypes.string,
  slug: PropTypes.string,
  toggleSection: PropTypes.func,
  user: PropTypes.shape({
    id: PropTypes.string
  })
};

NotificationSection.contextTypes = {
  notificationsCounter: PropTypes.shape({
    setUnread: PropTypes.func
  })
};

NotificationSection.defaultProps = {
  expanded: false,
  location: {
    query: {
      page: '1'
    }
  },
  notifications: [],
  projectID: '',
  section: '',
  slug: '',
  toggleSection: () => {},
  user: null
};
