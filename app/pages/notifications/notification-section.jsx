import React, { Component } from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import talkClient from 'panoptes-client/lib/talk-client';
import { Link } from 'react-router';
import Notification from './notification.cjsx';
import Paginator from '../../talk/lib/paginator.cjsx';
import ZooniverseLogo from '../../partials/zooniverse-logo.cjsx';
import getNotificationData from '../../lib/get-notification-data';
import Loading from '../../components/loading-indicator.cjsx';

export default class NotificationSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMeta: { },
      error: null,
      firstMeta: { },
      lastMeta: { },
      loading: false,
      notificationData: [],
      notificationsMap: { },
      page: 1
    };
    this.markAllRead = this.markAllRead.bind(this);
  }

  componentWillMount() {
    if (this.props.section === 'zooniverse') {
      this.setState({
        name: 'Zooniverse'
      });
    } else {
      apiClient.type('projects').get({ id: this.props.projectID, cards: true })
      .catch((error) => {
        this.setState({ error });
      })
      .then(([project]) => {
        this.setState({
          name: project.display_name,
          avatar: project.avatar_src
        });
      });
    }
  }

  componentDidMount() {
    this.getUnreadCount();
  }

  componentWillReceiveProps(nextProps) {
    const pageChanged = nextProps.location.query.page !== this.state.page;
    const userChanged = nextProps.user && nextProps.user !== this.props.user;
    if ((pageChanged || userChanged) && nextProps.expanded) {
      this.getNotifications(nextProps.location.query.page);
    }
  }

  componentWillUnmount() {
    if (this.props.user) {
      this.markAsRead('first');
      this.markAsRead('last');
    }
  }

  getNotifications(page) {
    this.setState({ loading: true });
    let firstMeta;
    let lastMeta;
    return talkClient.type('notifications').get({ page, page_size: 5, section: this.props.section })
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

        getNotificationData(newNotifications).then((notificationData) => {
          this.setState({ notificationData, loading: false });
        });

        this.setState({
          notifications: newNotifications,
          currentMeta: meta,
          firstMeta,
          lastMeta,
          notificationsMap,
          page
        });
        this.getUnreadCount();
      });
  }

  getUnreadCount() {
    return talkClient.type('notifications').get({ page: 1, page_size: 1, delivered: false, section: this.props.section })
    .catch((error) => {
      this.setState({ error });
    })
    .then(([project]) => {
      if (project) {
        const count = project.getMeta().count || 0;
        this.setState({ unread: count });
      } else {
        this.setState({ unread: 0 });
      }
    });
  }

  markAllRead() {
    this.state.notificationData.forEach((data) => {
      data.notification.update({ delivered: true });
    });
    this.setState({ unread: 0 });
    return talkClient.put('/notifications/read', { section: this.props.section }).then(() => {
      return talkClient.type('notifications').get({ page_size: 1, delivered: false }).then(([notification]) => {
        const count = notification ? notification.getMeta().count : 0;
        if (count === 0) this.context.notificationsCounter.setUnread(0);
      });
    });
  }

  markAsRead(position) {
    const ids = this.state[`${position}Meta`].notificationIds;
    const unread = [];

    if (ids !== undefined) {
      ids.forEach((id) => {
        if (!this.state.notificationsMap[id].delivered) unread.push(id);
      });

      if (unread.length === 0) return unread;

      this.state.notificationData.forEach((data) => {
        if (unread.indexOf(data.notification.id) > -1) {
          data.notification.update({ delivered: true }).save();
        }
      });
    }
    return null;
  }

  avatarFor() {
    const src = this.state.avatar ? `//${this.state.avatar}` : '/assets/simple-avatar.jpg';
    let avatar;

    if (this.state.unread > 0) return this.unreadCircle();

    if (this.state.name === 'Zooniverse') {
      avatar = <ZooniverseLogo width="40" height="40" />;
    } else {
      avatar = <img src={src} className="notification-section__img" alt="Project Avatar" />;
    }
    return (
      <Link to={this.props.slug ? `/projects/${this.props.slug}` : '/'}>
        {avatar}
      </Link>
    );
  }

  unreadCircle() {
    let centerNum = '40%';

    if (this.state.unread > 99) {
      centerNum = '20%';
    } else if (this.state.unread > 9) {
      centerNum = '30%';
    }
    const unreadNotifications = this.state.unread > 99 ? '99+' : this.state.unread;

    return (
      <svg className="notification-section__img">
        <circle cx="0" cy="0" r="100" fill="#E45950">
          <title> {`${this.state.unread} Unread Notification(s)`} </title>
        </circle>
        <text x={centerNum} y="50%" stroke="white" strokeWidth="2px" dy=".3em">{unreadNotifications}</text>
      </svg>
    );
  }

  renderHeader() {
    const buttonType = this.props.expanded ? 'fa fa-chevron-up fa-lg' : 'fa fa-chevron-down fa-lg';

    return (
      <div onClick={this.props.toggleSection}>
        <div className="notification-section__container">
          <div className="notification-section__item">
            {this.avatarFor()}
          </div>

          <div className="notification-section__item">
            <h3 className="notification-section__title">{this.state.name}</h3>
          </div>

          <div className="notification-section__item">
            <button className="notification-section__expand" title="Toggle Section">
              <i className={buttonType} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  renderError(item) {
    return (
      <div className="talk-module notification-section__error">
        {item.error}
      </div>
    );
  }

  render() {
    const l = this.state.currentMeta;
    const firstNotification = (l.page * l.page_size) - (l.page_size - 1) || 0;
    const lastNotification = Math.min(l.page_size * l.page, l.count) || 0;

    return (
      <div className="notification-section">

        {this.renderHeader()}

        {!!this.state.error && (
          <div className="notification-section__error">
            {this.state.error.toString()}
          </div>
        )}

        {this.state.loading && (
          <span className="notification-section__container">
            <Loading />
          </span>
        )}

        {(this.props.expanded && this.state.unread > 0) && (
          <button onClick={this.markAllRead}>
            Mark All Read
          </button>
        )}

        {(this.props.expanded && !this.state.loading) && (
          this.state.notificationData.map((item) => {
            if (item.notification) {
              return (
                <Notification
                  data={item.data}
                  key={item.notification.id}
                  notification={item.notification}
                  user={this.props.user}
                />);
            }
            return this.renderError(item);
          })
        )}

        {(this.props.expanded) && (
          <div className="centering">
            <Paginator
              className="notification-section__container"
              firstAndLast={false}
              itemCount
              nextLabel={<span>older <i className="fa fa-chevron-right" /></span>}
              onClickNext={this.markAsRead.bind(this, 'current')}
              page={+this.state.currentMeta.page}
              pageCount={this.state.lastMeta.page_count}
              pageSelector={false}
              previousLabel={<span><i className="fa fa-chevron-left" /> previous</span>}
              totalItems={<span className="notification-section__item-count">{firstNotification} - {lastNotification} of {l.count}</span>}
            />
          </div>
        )}

      </div>
    );
  }
}

NotificationSection.propTypes = {
  expanded: React.PropTypes.bool,
  projectID: React.PropTypes.string,
  section: React.PropTypes.string,
  slug: React.PropTypes.string,
  toggleSection: React.PropTypes.func,
  user: React.PropTypes.shape({
    display_name: React.PropTypes.string,
    login: React.PropTypes.string
  })
};

NotificationSection.contextTypes = {
  notificationsCounter: React.PropTypes.object
};

NotificationSection.defaultProps = {
  expanded: false,
  toggleSection: () => {}
};
