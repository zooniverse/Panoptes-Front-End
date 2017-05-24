import React from 'react';
import ReactDOM from 'react-dom';
import { routerShape } from 'react-router/lib/PropTypes';
import { Link } from 'react-router';
import auth from 'panoptes-client/lib/auth';
import talkClient from 'panoptes-client/lib/talk-client';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';
import TriggeredModalForm from 'modal-form/triggered';
import Avatar from '../partials/avatar';
import PassContext from '../components/pass-context';
import NotificationsLink from '../talk/lib/notifications-link';

const FOCUSABLES = 'a[href], button';

const UP = 38;
const DOWN = 40;

counterpart.registerTranslations('en', {
  accountMenu: {
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
    this.navigateMenu = this.navigateMenu.bind(this);
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

  navigateMenu(event) {
    const focusables = [ReactDOM.findDOMNode(this.accountMenuButton)];
    if (this.accountMenu) {
      const menuItems = this.accountMenu.querySelectorAll(FOCUSABLES);
      Array.prototype.forEach.call(menuItems, (item) => {
        focusables.push(item);
      });
    }
    const focusIndex = focusables.indexOf(document.activeElement);

    const newIndex = {
      [UP]: Math.max(0, focusIndex - 1),
      [DOWN]: Math.min(focusables.length - 1, focusIndex + 1)
    }[event.which];

    if (focusables[newIndex] !== undefined) {
      focusables[newIndex].focus();
      event.preventDefault();
    }
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
        <TriggeredModalForm
          ref={(button) => { this.accountMenuButton = button; }}
          className="site-nav__modal"
          trigger={
            <span className="site-nav__link">
              <strong>{this.context.user.display_name}</strong>{' '}
              <Avatar className="site-nav__user-avatar" user={this.context.user} size="2em" />
            </span>
          }
          triggerProps={{
            className: 'secret-button',
            onKeyDown: this.navigateMenu
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
        </TriggeredModalForm>

        <span className="site-nav__link-buncher" />

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
            {this.state.unread ?
              <i className="fa fa-envelope fa-fw" />
            :
              <i className="fa fa-envelope-o fa-fw" />}
          </span>
        </Link>

        <NotificationsLink params={this.props.params} user={this.context.user} linkProps={{
          className: 'site-nav__link site-nav__icon site-nav__icon--notifications',
          activeClassName: 'site-nav__link--active',
          onClick: this.logClick ? this.logClick.bind(this, 'accountMenu.notifications') : null
        }} />
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
