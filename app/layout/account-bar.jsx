import React from 'react';
import { routerShape } from 'react-router/lib/PropTypes';
import { Link } from 'react-router';
import auth from 'panoptes-client/lib/auth';
import talkClient from 'panoptes-client/lib/talk-client';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';
import Avatar from '../partials/avatar';
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

class AccountBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleSignOutClick = this.handleSignOutClick.bind(this);
    this.lookUpUnread = this.lookUpUnread.bind(this);
    this.state = {
      unread: false
    };
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
      this.setState({
        unread: conversations.length > 0
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

  render() {
    return (
      <span className="account-bar">
        <NotificationsLink params={this.props.params} user={this.context.user} linkProps={{
          className: 'site-nav__link site-nav__icon site-nav__icon--notifications',
          activeClassName: 'site-nav__link--active',
          onClick: this.logClick ? this.logClick.bind(this, 'accountMenu.notifications') : null
        }} />

        <Link
          to="/inbox"
          className="site-nav__link site-nav__icon site-nav__icon--inbox"
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
            <Translate content="accountMenu.messages" />
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
                <i className="fa fa-user fa-fw" />{' '}
                <Translate content="accountMenu.profile" />
              </Link>
              <br />
              <Link
                role="menuitem"
                to="/"
                className="site-nav__link"
                onClick={this.logClick ? this.logClick.bind(this, 'accountMenu.home') : null}
              >
                <i className="fa fa-home fa-fw" />{' '}
                <Translate content="accountMenu.home" />
              </Link>
              <br />
              <Link
                role="menuitem"
                to="/settings"
                className="site-nav__link"
                onClick={this.logClick ? this.logClick.bind(this, 'accountMenu.settings') : null}
              >
                <i className="fa fa-cogs fa-fw" />{' '}
                <Translate content="accountMenu.settings" />
              </Link>
              <br />
              <Link
                role="menuitem"
                to={`/collections/${this.context.user.login}`}
                className="site-nav__link"
                onClick={this.logClick ? this.logClick.bind(this, 'accountMenu.collections') : null}
              >
                <i className="fa fa-image fa-fw" />{' '}
                <Translate content="accountMenu.collections" />
              </Link>
              <br />
              <Link
                role="menuitem"
                to={`/favorites/${this.context.user.login}`}
                className="site-nav__link"
                onClick={this.logClick ? this.logClick.bind(this, 'accountMenu.favorites') : null}
              >
                <i className="fa fa-star fa-fw" />{' '}
                <Translate content="accountMenu.favorites" />
              </Link>
              <hr />
              <button
                role="menuitem"
                type="button"
                className="secret-button"
                onClick={this.handleSignOutClick}
              >
                <span className="site-nav__link">
                  <i className="fa fa-sign-out fa-fw" />{' '}
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
  user: React.PropTypes.object,
  router: routerShape,
  geordi: React.PropTypes.object
};

AccountBar.propTypes = {
  params: React.PropTypes.array
};

export default AccountBar;
