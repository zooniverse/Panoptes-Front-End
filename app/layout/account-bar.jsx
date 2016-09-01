import React from 'react';
import { routerShape } from 'react-router/lib/PropTypes';
import { Link } from 'react-router';
import auth from 'panoptes-client/lib/auth';
import talkClient from 'panoptes-client/lib/talk-client';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';
import Avatar from '../partials/avatar';
import TriggeredModalForm from 'modal-form/triggered';
import PassContext from '../components/pass-context';
import NotificationsLink from '../talk/lib/notifications-link';

const FOCUSABLES = 'a[href], button';

const UP = 38;
const DOWN = 40;

counterpart.registerTranslations('en', {
  accountMenu: {
    profile: 'Profile',
    settings: 'Settings',
    signOut: 'Sign Out',
    collections: 'Collections',
    favorites: 'Favorites',
  },
});

const AccountBar = React.createClass({
  contextTypes: {
    user: React.PropTypes.object,
    router: routerShape,
    geordi: React.PropTypes.object,
  },

  getInitialState() {
    return {
      unread: false,
    };
  },

  componentDidMount() {
    addEventListener('locationchange', this.lookUpUnread);
    this.lookUpUnread();
  },

  componentWillReceiveProps(nextProps, nextContext) {
    this.logClick = !!nextContext &&
      !!nextContext.geordi &&
      !!nextContext.geordi.makeHandler &&
      nextContext.geordi.makeHandler('about-menu');
  },

  componentWillUnmount() {
    removeEventListener('locationchange', this.lookUpUnread);
  },

  lookUpUnread() {
    talkClient.type('conversations').get({
      user_id: this.context.user.id,
      unread: true,
      page_size: 1,
    }).then((conversations) => {
      this.setState({
        unread: conversations.length > 0,
      });
    });
  },

  handleAccountMenuOpen() {
    setTimeout(() => { // Wait for the modal's internal state change to happen.
      if (this.refs.accountMenuButton.state.open) {
        // React's `autoFocus` apparently doesn't work on <a> tags.
        const firstFocusable = this.refs.accountMenu.querySelector(FOCUSABLES);
        if (!!firstFocusable) {
          firstFocusable.focus();
        }
      }
    });
  },

  navigateMenu(event) {
    const focusables = this.refs.accountMenu.querySelectorAll(FOCUSABLES);
    const focusIndex = Array.prototype.indexOf.call(focusables, document.activeElement);

    const newIndex = {
      [UP]: Math.max(0, focusIndex - 1),
      [DOWN]: Math.min(focusables.length - 1, focusIndex + 1),
    }[event.which];

    if (focusables[newIndex] !== undefined) {
      focusables[newIndex].focus();
      event.preventDefault();
    }
  },

  handleSignOutClick() {
    !!this.logClick && this.logClick('accountMenu.signOut');
    !!this.context.geordi && this.context.geordi.logEvent({
      type: 'logout',
    });

    auth.signOut();
  },

  render() {
    return (
      <span className="account-bar">
        <TriggeredModalForm
          ref="accountMenuButton"
          className="site-nav__modal"
          trigger={
            <span className="site-nav__link">
              <strong>{this.context.user.display_name}</strong>{' '}
              <Avatar className="site-nav__user-avatar" user={this.context.user} size="2em" />
            </span>
          }
          triggerProps={{
            className: 'secret-button',
            onClick: this.handleAccountMenuOpen,
          }}
        >
          <PassContext context={this.context}>
            <div ref="accountMenu" role="menu" onKeyDown={this.navigateMenu}>
              <Link
                role="menuitem"
                to={`/users/${this.context.user.login}`}
                className="site-nav__link"
                onClick={!!this.logClick ? this.logClick.bind(this, 'accountMenu.profile') : null}
              >
                <i className="fa fa-user fa-fw"></i>{' '}
                <Translate content="accountMenu.profile" />
              </Link>
              <br />
              <Link
                role="menuitem"
                to="/settings"
                className="site-nav__link"
                onClick={!!this.logClick ? this.logClick.bind(this, 'accountMenu.settings') : null}
              >
                <i className="fa fa-cogs fa-fw"></i>{' '}
                <Translate content="accountMenu.settings" />
              </Link>
              <br />
              <Link
                role="menuitem"
                to={`/collections/${this.context.user.login}`}
                className="site-nav__link"
                onClick={!!this.logClick ? this.logClick.bind(this, 'accountMenu.collections') : null}
              >
                <i className="fa fa-image fa-fw"></i>{' '}
                <Translate content="accountMenu.collections" />
              </Link>
              <br />
              <Link
                role="menuitem"
                to={`/favorites/${this.context.user.login}`}
                className="site-nav__link"
                onClick={!!this.logClick ? this.logClick.bind(this, 'accountMenu.favorites') : null}
              >
                <i className="fa fa-star fa-fw"></i>{' '}
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
                  <i className="fa fa-sign-out fa-fw"></i>{' '}
                  <Translate content="accountMenu.signOut" />
                </span>
              </button>
            </div>
          </PassContext>
        </TriggeredModalForm>

        <span className="site-nav__link-buncher"></span>

        <Link
          to="/inbox"
          className="site-nav__link site-nav__icon site-nav__icon--inbox"
          activeClassName="site-nav__link--active"
          aria-label={`
            Inbox ${this.state.unread ? 'with unread messages' : ''}
          `.trim()}
          onClick={!!this.logClick ? this.logClick.bind(this, 'accountMenu.inbox', 'top-menu') : null}
        >
          <span
            className={`
              site-nav__inbox-link
              ${this.state.unread ? 'site-nav__inbox-link--unread' : ''}
            `.trim()}
          >
            {this.state.unread ?
              <i className="fa fa-envelope fa-fw" />
            :
              <i className="fa fa-envelope-o fa-fw" />}
          </span>
        </Link>

        <NotificationsLink params={this.props.params} user={this.context.user} linkProps={{
          className: 'site-nav__link site-nav__icon site-nav__icon--notifications',
          activeClassName: 'site-nav__link--active',
          onClick: !!this.logClick ? this.logClick.bind(this, 'accountMenu.notifications') : null
        }} />
      </span>
    );
  },
});

export default AccountBar;
