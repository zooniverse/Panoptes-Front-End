import PropTypes from 'prop-types';
import React from 'react';
import { routerShape } from 'react-router/lib/PropTypes';
import { Link } from 'react-router';
import auth from 'panoptes-client/lib/auth';
import talkClient from 'panoptes-client/lib/talk-client';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';
import PassContext from '../components/pass-context';
import NotificationsLink from '../talk/lib/notifications-link';
import ExpandableMenu from './expandable-menu';

counterpart.registerTranslations('en', {
  accountMenu: {
    messages: 'Messages',
    profile: 'Profile',
    home: 'Home',
    settings: 'Settings',
    signOut: 'Sign Out',
    collections: 'Collections',
    favorites: 'Favorites'
  }
});

export default class AccountBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messageCount: 0,
      unread: false
    };

    this.handleSignOutClick = this.handleSignOutClick.bind(this);
    this.lookUpUnread = this.lookUpUnread.bind(this);
  }

  componentDidMount() {
    addEventListener('locationchange', this.lookUpUnread);
    this.lookUpUnread();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.logClick = !!nextContext &&
      !!nextContext.geordi &&
      !!nextContext.geordi.makeHandler &&
      nextContext.geordi.makeHandler('about-menu');
  }

  componentWillUnmount() {
    removeEventListener('locationchange', this.lookUpUnread);
  }

  lookUpUnread() {
    talkClient.type('conversations').get({
      user_id: this.context.user.id,
      unread: true,
      page_size: 1
    }).then((conversations) => {
      const unread_messages = conversations.length > 0;
      const unread_count = unread_messages ? conversations[0].getMeta().count : 0;
      this.setState({
        messageCount: unread_count,
        unread: unread_messages
      });
    });
  }

  handleSignOutClick() {
    !!this.logClick && this.logClick('accountMenu.signOut');
    !!this.context.geordi && this.context.geordi.logEvent({
      type: 'logout'
    });

    auth.signOut();
  }

  renderMessages() {
    const mobile = this.state.unread ?
      <i className="fa fa-envelope fa-fw" aria-label={`${this.state.messageCount} unread messages`} /> :
      <i className="fa fa-envelope-o fa-fw" aria-label="No new messages" />;

    if (this.props.isMobile) {
      return mobile;
    } else {
      return (
        <div>
          <Translate content="accountMenu.messages" />
          {this.state.unread && (` (${this.state.messageCount})`)}
        </div>
      );
    }
  }

  render() {
    return (
      <span className="account-bar">

        <NotificationsLink isMobile={this.props.isMobile} params={this.props.params} user={this.context.user} linkProps={{
          className: 'site-nav__link',
          activeClassName: 'site-nav__link--active',
          onClick: this.logClick ? this.logClick.bind(this, 'accountMenu.notifications') : null
        }} />

        <Link
          to="/inbox"
          className="site-nav__link site-nav__link--inbox"
          activeClassName="site-nav__link--active"
          aria-label={`
            Inbox ${this.state.unread ? 'with unread messages' : ''}
          `.trim()}
          onClick={this.logClick ? this.logClick.bind(this, 'accountMenu.inbox', 'top-menu') : null}
        >
          <span
            className={`
              site-nav__inbox-link
              ${this.state.unread ? 'site-nav__inbox-link--unread' : ''}
            `.trim()}
          >
            {this.renderMessages()}
          </span>
        </Link>

        <ExpandableMenu
          className="site-nav__modal"
          trigger={
            <span className="site-nav__link">
              <strong>{this.context.user.display_name}</strong>{' '}
              <i className="fa fa-chevron-down" />
            </span>
          }
          triggerProps={{
            className: 'secret-button'
          }}
        >
          <PassContext context={this.context}>
            <div ref={(menu) => { this.accountMenu = menu; }} role="menu" onKeyDown={this.navigateMenu}>
              <Link
                role="menuitem"
                to={`/users/${this.context.user.login}`}
                className="site-nav__link"
                onClick={this.logClick ? this.logClick.bind(this, 'accountMenu.profile') : null}
              >
                <Translate content="accountMenu.profile" />
              </Link>
              <br />
              <Link
                role="menuitem"
                to="/"
                className="site-nav__link"
                onClick={this.logClick ? this.logClick.bind(this, 'accountMenu.home') : null}
              >
                <Translate content="accountMenu.home" />
              </Link>
              <br />
              <Link
                role="menuitem"
                to="/settings"
                className="site-nav__link"
                onClick={this.logClick ? this.logClick.bind(this, 'accountMenu.settings') : null}
              >
                <Translate content="accountMenu.settings" />
              </Link>
              <br />
              <Link
                role="menuitem"
                to={`/collections/${this.context.user.login}`}
                className="site-nav__link"
                onClick={this.logClick ? this.logClick.bind(this, 'accountMenu.collections') : null}
              >
                <Translate content="accountMenu.collections" />
              </Link>
              <br />
              <Link
                role="menuitem"
                to={`/favorites/${this.context.user.login}`}
                className="site-nav__link"
                onClick={this.logClick ? this.logClick.bind(this, 'accountMenu.favorites') : null}
              >
                <Translate content="accountMenu.favorites" />
              </Link>
              <br />
              <button
                role="menuitem"
                type="button"
                className="secret-button"
                onClick={this.handleSignOutClick}
              >
                <span className="site-nav__link">
                  <Translate content="accountMenu.signOut" />
                </span>
              </button>
            </div>
          </PassContext>
        </ExpandableMenu>

      </span>
    );
  }
}

AccountBar.contextTypes = {
  user: PropTypes.object,
  router: routerShape,
  geordi: PropTypes.object
};

AccountBar.propTypes = {
  params: PropTypes.object,
  isMobile: PropTypes.bool
};