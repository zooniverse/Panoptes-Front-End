import PropTypes from 'prop-types';
import React, { Component } from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import { Link } from 'react-router';
import Notification from './notification.cjsx';
import Paginator from '../../talk/lib/paginator.cjsx';
import ZooniverseLogo from '../../partials/zooniverse-logo.cjsx';
import getNotificationData from '../../lib/get-notification-data';
import Loading from '../../components/loading-indicator';

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
    // this.markAllRead = this.markAllRead.bind(this);
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

  // TODO: check if works or remove
  // markAllRead() {
  //   const { notificationsCounter } = this.context;
  //   const { section } = this.props;
  //   const { notificationData } = this.state;

  //   const requestSection = section === 'zooniverse' ? 'zooniverse' : `project-${section}`;

  //   notificationData.forEach((data) => {
  //     data.notification.update({ delivered: true });
  //   });
  //   return talkClient
  //     .put('/notifications/read', { section: requestSection })
  //     .then(() => talkClient
  //       .type('notifications')
  //       .get({ page_size: 1, delivered: false })
  //       .then(([notification]) => {
  //         const count = notification ? notification.getMeta().count : 0;
  //         if (count === 0) notificationsCounter.setUnread(0);
  //       }));
  // }

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

  avatarFor() {
    const { slug, unread } = this.props;
    const { avatar, name } = this.state;

    const src = avatar || '/assets/simple-avatar.jpg';
    let sectionAvatar;

    if (unread > 0) return this.unreadCircle();

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

  unreadCircle() {
    const { unread } = this.props;

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

  renderHeader() {
    const { expanded, toggleSection } = this.props;
    const { name } = this.state;

    const buttonType = expanded ? 'fa fa-chevron-up fa-lg' : 'fa fa-chevron-down fa-lg';

    return (
      <div onClick={toggleSection}>
        <div className="notification-section__container">
          <div className="notification-section__item">
            {this.avatarFor()}
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
      expanded, location, notifications, unread, user
    } = this.props;
    const {
      error, loading, notificationData, project
    } = this.state;

    const page = parseInt(location.query.page, 10) || 1;
    const pageCount = Math.ceil(notifications.length / 5);
    const firstNotification = (page - 1) * 5 + 1;
    const lastNotification = Math.min(page * 5, notifications.length);

    return (
      <div className="notification-section">

        {this.renderHeader()}

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

        {/* {(expanded && unread > 0) && (
          <button onClick={this.markAllRead}>
            Mark All Read
          </button>
        )} */}

        {(expanded && !loading) && (
          notificationData.map((item) => {
            if (item.notification) {
              return (
                <Notification
                  data={item.data}
                  key={item.notification.id}
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
  unread: PropTypes.number,
  user: PropTypes.shape({
    display_name: PropTypes.string,
    login: PropTypes.string
  })
};

NotificationSection.contextTypes = {
  notificationsCounter: PropTypes.object
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
  unread: 0
};
