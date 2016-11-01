import React from 'react';
import Notification from './notification';
import apiClient from 'panoptes-client/lib/api-client';
import talkClient from 'panoptes-client/lib/talk-client';
import { Link } from 'react-router';
import Paginator from '../../talk/lib/paginator';
import updateQueryParams from '../../talk/lib/update-query-params';

const NotificationSection = React.createClass({

  propTypes: {
    callbackParent: React.PropTypes.func,
    expanded: React.PropTypes.bool,
    location: React.PropTypes.object,
    project: React.PropTypes.object,
    projectID: React.PropTypes.string,
    section: React.PropTypes.string,
    slug: React.PropTypes.string,
    user: React.PropTypes.object,
  },

  contextTypes: {
    notificationsCounter: React.PropTypes.object,
    router: React.PropTypes.object.isRequired,
  },

  getDefaultProps() {
    return {
      location: { query: { page: 1 } },
    };
  },

  getInitialState() {
    return {
      firstMeta: { },
      lastMeta: { },
      notificationsMap: { },
      notifications: [],
    };
  },

  componentWillMount() {
    if (this.props.user) this.getNotifications();
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
          name: project.display_name,
          avatar: project.avatar_src,
        });
      });
    }
  },

  componentDidMount() {
    this.getUnreadCount();
  },

  componentWillReceiveProps(nextProps) {
    const pageChanged = nextProps.location.query.page !== this.props.location.query.page;
    const userChanged = nextProps.user && nextProps.user !== this.props.user;
    if (pageChanged || userChanged) {
      this.getNotifications(nextProps.location.query.page);
    }
  },

  componentWillUnmount() {
    if (this.props.user) {
      this.markAsRead('first');
      this.markAsRead('last');
    }
  },

  getNotifications(page) {
    let firstMeta;
    let lastMeta;
    this.getUnreadCount();
    return talkClient.type('notifications').get(this.notificationsQuery(page))
      .then((newNotifications) => {
        const meta = newNotifications[0] ? newNotifications[0].getMeta() : { };
        const notificationsMap = this.state.notificationsMap;
        firstMeta = this.state.firstMeta;
        lastMeta = this.state.lastMeta;

        meta.notificationIds = [];
        newNotifications.forEach((notification, i) => {
          notificationsMap[notification.id] = notification;
          meta.notificationIds.push(newNotifications[i].id);
        });

        if (meta.page > this.state.lastMeta.page) {
          lastMeta = meta;
        } else if (meta.page < this.state.firstMeta.page) {
          firstMeta = meta;
        } else {
          firstMeta = lastMeta = meta;
        }

        this.setState({
          notifications: newNotifications,
          notificationsMap: notificationsMap,
          firstMeta: firstMeta,
          lastMeta: lastMeta,
        });
      });
  },

  onSectionToggle() {
    const expandToggle = this.props.expanded ? false : this.props.projectID;
    updateQueryParams(this.context.router, { page: 1 });
    this.props.callbackParent(expandToggle);
  },

  getUnreadCount() {
    return talkClient.type('notifications').get({ page: 1, page_size: 1, delivered: false, section: this.props.section })
    .catch(() => {
      return null;
    })
    .then(([project]) => {
      if (project) {
        const count = project.getMeta().count || 0;
        this.setState({ unread: count });
      } else {
        this.setState({ unread: 0 });
      }
    });
  },

  markAsRead(position) {
    const ids = this.state[`${position}Meta`].notificationIds;
    const unread = [];
    ids.forEach((id) => {
      if (!this.state.notificationsMap[id].delivered) {
        unread.push(id);
      }
    });

    if (unread.length === 0) return unread;

    this.state.notifications.forEach((notification) => {
      if (unread.indexOf(notification.id) > -1) {
        notification.update({ delivered: true });
      }
    });
  },

  notificationsQuery(page = this.props.location.query.page, options = { }) {
    const query = Object.assign({}, options, {
      page: page,
      page_size: 5,
    });

    if (this.props.section) {
      query.section = this.props.section;
    }
    return query;
  },

  avatarFor() {
    const src = this.state.avatar ? `//${this.state.avatar}` : '/assets/simple-avatar.jpg';
    if (this.state.unread > 0) {
      return this.unreadCircle();
    }
    return <img src={src} className="notification-section__img" alt="Project Avatar" />;
  },

  unreadCircle() {
    return (
      <svg className="notification-section__img">
        <circle cx="0" cy="0" r="100" fill="#E45950">
          <title>
            {`${this.state.unread} Unread Notification(s)`}
          </title>
        </circle>
        <text x="40%" y="50%" stroke="white" strokeWidth="2px" dy=".3em">{this.state.unread}</text>
      </svg>
    );
  },

  renderHeader() {
    const buttonType = this.props.expanded ? 'fa fa-times fa-lg' : 'fa fa-chevron-down fa-lg';
    const projLink = this.props.slug ? `/projects/${this.props.slug}` : '/';

    return (
      <div>

        <div className="notification-section__container">
          <div className="notification-section__item">
            {this.avatarFor()}
          </div>

          <div className="notification-section__item">
            <Link to={projLink} className="notification-section__title">
              <h3 className="notification-section__title">{this.state.name}</h3>
            </Link>
          </div>

          <div className="notification-section__item">
            <button title="Remove choice" onClick={this.onSectionToggle}>
              <i className={buttonType}></i>
            </button>
          </div>
        </div>
      </div>
    );
  },

  render() {
    const l = this.state.lastMeta;

    return (
      <div className="notification-section">

        {this.renderHeader()}

        {this.props.expanded && (
          this.state.notifications.map((notification) => {
            return (
              <Notification
                notification={notification}
                key={notification.id}
                user={this.props.user}
              />);
          })
        )}

        {this.props.expanded && (
          <div className="centering">
            <Paginator
              className="notification-section__container"
              page={+this.state.lastMeta.page}
              pageCount={this.state.lastMeta.page_count}
              itemCount={true}
              scrollOnChange={false}
              firstAndLast={false}
              pageSelector={false}
              nextLabel={<span>older <i className="fa fa-chevron-right" /></span>}
              previousLabel={<span><i className="fa fa-chevron-left" /> previous</span>}
              onClickNext={this.markAsRead.bind(this, 'last')}
              totalItems={<span>{(l.page * l.page_size) - (l.page_size - 1)} - {Math.min(l.page_size * l.page, l.count)} of {l.count}</span>}
            />
          </div>
        )}

      </div>
    );
  },
});

export default NotificationSection;
