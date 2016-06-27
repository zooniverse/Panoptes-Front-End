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
import AccountBar from './account-bar';
import LoginBar from './login-bar';

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
  },
});

const SiteNav = React.createClass({
  resizeTimeout: NaN,

  contextTypes: {
    user: React.PropTypes.object,
    router: routerShape,
    geordi: React.PropTypes.object,
  },

  propTypes: {
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

        {!!this.context.user ? <AccountBar /> : <LoginBar />}

        {!!this.props.onToggle &&
          <button
            type="button"
            className="secret-button site-nav__reveal-toggle"
            style={{ lineHeight: 0 }}
            onClick={this.props.onToggle}
          >{logo}</button>}

        {this.state.isMobile && this.renderMobileLinksMenu()}
      </nav>
    );
  },
});

export default SiteNav;
