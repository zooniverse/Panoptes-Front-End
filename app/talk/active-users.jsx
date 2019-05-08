import React from 'react';
import PropTypes from 'prop-types';
import apiClient from 'panoptes-client/lib/api-client';
import { sugarApiClient } from 'panoptes-client/lib/sugar';
import { Link } from 'react-router';
import Paginator from './lib/paginator';
import activeUserCache from './lib/active-user-cache';

export default class ActiveUsers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      pageCount: 0,
      perPage: 10,
      total: 0,
      userRecords: activeUserCache,
      users: []
    };

    this.onPageChange = this.onPageChange.bind(this);
  }

  componentDidMount() {
    this.update();
  }

  componentWillUnmount() {
    this.resetTimer();
  }

  onPageChange(page) {
    this.setState({ page });
    this.update();
  }

  getActiveUserIds() {
    return sugarApiClient.get('/active_users', { channel: this.props.section })
      .then(activeUserIds =>
        activeUserIds.map(user => user.id).reverse()
      )
      .catch(() => {
        this.restartTimer();
      });
  }

  userIdsOnPage(ids, page) {
    const offset = (page - 1) * this.state.perPage;
    return [].concat(ids).slice(offset, offset + this.state.perPage);
  }

  fetchUncachedUsers(ids) {
    const cachedIds = Object.keys(activeUserCache);

    const uncachedIds = ids.map((id) => {
      if (!cachedIds.includes(id)) {
        return id;
      }
    });

    if (uncachedIds.length > 0) {
      return apiClient.type('users').get({ id: uncachedIds });
    }
    return Promise.resolve([]);
  }

  cacheUsers(users) {
    users.forEach((user) => {
      activeUserCache[user.id] = user;
    });
  }

  update() {
    this.restartTimer();
    this.getActiveUserIds().then((userIds) => {
      const pageCount = this.pageCount(userIds);
      const page = this.boundedPage(pageCount);
      const onPage = this.userIdsOnPage(userIds, page);

      this.fetchUncachedUsers(onPage).then(this.cacheUsers)
        .then(() => {
          const activeUsers = onPage.map((id) => {
            if (this.state.userRecords[id]) {
              return this.state.userRecords[id];
            }
          });
          this.setState({
            page,
            pageCount,
            total: userIds.length,
            userRecords: activeUserCache,
            users: activeUsers
          });
          this.restartTimer();
        })
        .catch(() => {
          this.restartTimer();
        });
    });
  }

  boundedPage(pageCount) {
    if (this.state.page > pageCount) {
      return pageCount;
    } else if (this.state.page < 1) {
      return 1;
    }
    return this.state.page;
  }

  pageCount(userIds) {
    return Math.ceil(userIds.length / this.state.perPage);
  }

  resetTimer() {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }
  }

  restartTimer() {
    this.resetTimer();
    this.updateTimeout = setTimeout(this.update, 60000);
  }

  userLink(user) {
    let baseLink = '/';
    let logClick = () => {};
    if (this.props.project) {
      baseLink += `projects/${this.props.project.slug}/`;
    }
    if (this.context.geordi && this.context.geordi.makeHandler) {
      logClick = this.context.geordi.makeHandler('view-profile-sidebar');
    }
    if (user && user.id && user.display_name && user.login) {
      return (
        <li key={user.id}>
          <Link
            to={`${baseLink}users/${user.login}`}
            title={`${user.display_name}'s profile`}
            onClick={logClick.bind(this, user.display_name)}
          >
            {user.display_name}
          </Link>
        </li>
      );
    }

    return null
  }

  render() {
    return (
      <div className="talk-active-users">
        <h3>
          {this.state.total} Active Participants:
        </h3>
        <ul>
          {this.state.users.map(user =>
            this.userLink(user)
          )}
        </ul>
        {this.state.pageCount > 1 && (
          <Paginator
            page={+this.state.page}
            onPageChange={this.onPageChange}
            pageCount={this.state.pageCount}
            scrollOnChange={false}
            firstAndLast={false}
            pageSelector={false}
          />
        )}
      </div>
    );
  }
}

ActiveUsers.contextTypes = {
  geordi: PropTypes.object
};

ActiveUsers.defaultProps = {
  project: null,
  section: ''
};

ActiveUsers.propTypes = {
  project: PropTypes.shape({
    slug: PropTypes.string
  }),
  section: PropTypes.string
};
