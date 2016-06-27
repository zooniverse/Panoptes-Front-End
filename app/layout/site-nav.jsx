import React from 'react';
import counterpart from 'counterpart';
import classnames from 'classnames';
import {routerShape} from 'react-router/lib/PropTypes';
import PassContext from '../components/pass-context';
import { Link, IndexLink } from 'react-router';
import Translate from 'react-translate-component';
import AdminOnly from '../components/admin-only';
import TriggeredModalForm from 'modal-form/triggered';
import ZooniverseLogo from '../partials/zooniverse-logo';
import alert from '../lib/alert';
import LoginDialog from '../partials/login-dialog';
import AccountBar from './account-bar';

import style from './site-nav.styl';
void style;

const MAX_MOBILE_WIDTH = 875;

counterpart.registerTranslations('en', {
  siteNav: {
    home: 'Zooniverse',
    projects: 'Projects',
    about: 'About',
    collect: 'Collect',
    talk: 'Talk',
    daily: 'Daily Zooniverse',
    blog: 'Blog',
    lab: 'Build a project',
    admin: 'Admin',
    notifications: 'Notifications',
    signIn: 'Sign in',
    register: 'Register',
  },
});

const SiteNav = React.createClass({
  resizeTimeout: NaN,

  contextTypes: {
    router: routerShape,
    geordi: React.PropTypes.object,
  },

  propTypes: {
    user: React.PropTypes.any,
    onToggle: React.PropTypes.func,
  },

  getInitialState() {
    return {
      isMobile: true
    };
  },

  componentDidMount() {
    this.handleResize();
    addEventListener('resize', this.handleResize);
  },

  componentWillUnmount() {
    addEventListener('resize', this.handleResize);
  },

  handleResize() {
    if (!isNaN(this.resizeTimeout)) {
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout(() => {
      this.setState({
        isMobile: innerWidth < MAX_MOBILE_WIDTH,
      }, () => {
        this.resizeTimeout = NaN;
      });
    }, 100);
  },

  componentWillReceiveProps(nextProps, nextContext) {
    this.logClick = !!nextContext &&
      !!nextContext.geordi &&
      !!nextContext.geordi.makeHandler &&
      nextContext.geordi.makeHandler('top-menu');
  },

  showSignInDialog(event) {
    const which = event.currentTarget.value;
    if (this.context.geordi !== undefined) {
      this.context.geordi.logEvent({
        type: which === 'sign-in' ? 'login' : 'register-link',
      });
    }
    alert((resolve) => <LoginDialog which={which} onSuccess={resolve} contextRef={this.context} />);
  },

  renderLinks(isMobile) {
    return (
      <span
        className={classnames('site-nav__main-links', {
          'site-nav__main-links--vertical': this.state.isMobile
        })}
      >
        <Link
          to="/projects"
          className="site-nav__link"
          activeClassName="site-nav__link--active"
          onClick={!!this.logClick ? this.logClick.bind(this, 'mainNav.projects') : null}
        >
          <Translate content="siteNav.projects" />
        </Link>{' '}
        <Link
          to="/about"
          className="site-nav__link"
          activeClassName="site-nav__link--active"
          onClick={!!this.logClick ? this.logClick.bind(this, 'mainNav.about') : null}
        >
          <Translate content="siteNav.about" />
        </Link>{' '}
        <Link
          to="/talk"
          className="site-nav__link"
          activeClassName="site-nav__link--active"
          onClick={!!this.logClick ? this.logClick.bind(this, 'mainNav.talk') : null}
        >
          <Translate content="siteNav.talk" />
        </Link>{' '}
        <Link
          to="/notifications"
          className="site-nav__link"
          activeClassName="site-nav__link--active"
          onClick={!!this.logClick ? this.logClick.bind(this, 'mainNav.notifications') : null}
        >
          <Translate content="siteNav.notifications" />
        </Link>{' '}
        <Link
          to="/collections"
          className="site-nav__link"
          activeClassName="site-nav__link--active"
          onClick={!!this.logClick ? this.logClick.bind(this, 'mainNav.collect') : null}
        >
          <Translate content="siteNav.collect" />
        </Link>{' '}
        <Link
          to="/lab"
          className="site-nav__link"
          activeClassName="site-nav__link--active"
          onClick={!!this.logClick ? this.logClick.bind(this, 'mainNav.lab') : null}
        >
          <span className="site-nav__link-label-for-builders">
            <Translate content="siteNav.lab" />
          </span>
        </Link>{' '}

        <AdminOnly whenActive>
          <Link
            to={"/admin"}
            className="site-nav__link"
            activeClassName="site-nav__link--active"
            onClick={!!this.logClick ? this.logClick.bind(this, 'mainNav.admin') : null}
          >
            <span className="site-nav__link-label-for-builders">
              <Translate content="siteNav.admin" />
            </span>
          </Link>
        </AdminOnly>

        <TriggeredModalForm
          className="site-nav__modal"
          trigger={
            <span
              className="site-nav__link"
              activeClassName="site-nav__link--active"
              title="More links"
              aria-label="More links"
            >• • •</span>
          }
        >
          <a
            href="http://daily.zooniverse.org/"
            className="site-nav__link"
            activeClassName="site-nav__link--active"
            target="_blank"
            onClick={!!this.logClick ? this.logClick.bind(this, 'mainNav.daily', 'globe-menu') : null}
          >
            <Translate content="siteNav.daily" />
          </a>
          <br />
          <a
            href="http://blog.zooniverse.org/"
            className="site-nav__link"
            activeClassName="site-nav__link--active"
            target="_blank"
            onClick={!!this.logClick ? this.logClick.bind(this, 'mainNav.blog', 'globe-menu') : null}
          >
            <Translate content="siteNav.blog" />
          </a>
        </TriggeredModalForm>
      </span>
    );
  },

  renderMobileLinksMenu() {
    return (
      <TriggeredModalForm
        className="site-nav__modal"
        trigger={
          <span
            className="site-nav__link"
            activeClassName="site-nav__link--active"
            title="Site navigation"
            aria-label="Site navigation"
          >
            <span style={{ display: 'inline-block', transform: 'scale(2.5, 2)' }}>≡</span>
          </span>
        }
      >
        <PassContext context={this.context}>
          {this.renderLinks()}
        </PassContext>
      </TriggeredModalForm>
    );
  },

  renderShortSignInButton() {
    return (
      <TriggeredModalForm
        trigger={
          <span className="site-nav__link">Sign in</span>
        }
      >
        <LoginBar />
      </TriggeredModalForm>
    );
  },

  render() {
    const logo = <ZooniverseLogo width="1.8em" height="1.8em" style={{ verticalAlign: '-0.5em' }} />;

    return (
      <nav className="site-nav">
        <IndexLink
          to="/"
          className="site-nav__link"
          activeClassName="site-nav__link--active"
          onClick={!!this.logClick ? this.logClick.bind(this, 'logo') : null}
        >
          {!!this.props.onToggle ? <Translate component="strong" content="siteNav.home" /> : logo}
        </IndexLink>

        {!this.state.isMobile && this.renderLinks()}

        {!this.props.onToggle && (!!this.props.user ? (
          <AccountBar user={this.props.user} />
        ) : (
          <span>
            <button type="button" value="sign-in" className="secret-button" onClick={this.showSignInDialog}>
              <span className="site-nav__link site-nav__link--leading">
                <Translate content="siteNav.signIn" />
              </span>
            </button>

            <button type="button" value="register" className="secret-button" onClick={this.showSignInDialog}>
              <span className="site-nav__link site-nav__link--trailing">
                <Translate content="siteNav.register" />
              </span>
            </button>
          </span>
        ))}

        {!!this.props.onToggle &&
          <span className="site-nav__demoted-floater">
            {!!this.props.user ? (
              <AccountBar user={this.props.user} />
            ) : (
              <button type="button" value="sign-in" className="secret-button" onClick={this.showSignInDialog}>
                <span className="site-nav__link site-nav__link--leading">
                  <span className="site-nav__link-label-for-builders">
                    <Translate content="siteNav.signIn" />
                  </span>
                </span>
              </button>
            )}

            <button
              type="button"
              className="secret-button"
              style={{ lineHeight: 0 }}
              onClick={this.props.onToggle}
            >
              <span className="site-nav__link site-nav__link--trailing site-nav__reveal-toggle">
                {logo}
              </span>
            </button>
          </span>}

        {this.state.isMobile && this.renderMobileLinksMenu()}
      </nav>
    );
  },
});

export default SiteNav;
