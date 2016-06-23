import React from 'react';
import counterpart from 'counterpart';
import { Link, IndexLink } from 'react-router';
import Translate from 'react-translate-component';
import AdminOnly from '../components/admin-only';
import TriggeredModalForm from 'modal-form/triggered';
import ZooniverseLogo from '../partials/zooniverse-logo';
import AccountBar from './account-bar';
import LoginBar from './login-bar';

import style from './site-nav.styl';
void style;

counterpart.registerTranslations('en', {
  siteNav: {
    home: 'Home',
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
  contextTypes: {
    geordi: React.PropTypes.object,
  },

  propTypes: {
    user: React.PropTypes.any,
    onToggle: React.PropTypes.func,
  },

  componentWillReceiveProps(nextProps, nextContext) {
    this.logClick = !!nextContext &&
      !!nextContext.geordi &&
      !!nextContext.geordi.makeHandler &&
      nextContext.geordi.makeHandler('top-menu');
  },

  renderMainLinks() {
    return (
      <span className="site-nav__main-links">
        <Link
          to="/projects"
          className="site-nav__link"
          activeClassName="site-nav__link--active"
          onClick={!!this.logClick && this.logClick.bind(this, 'mainNav.projects')}
        >
          <Translate content="siteNav.projects" />
        </Link>{' '}
        <Link
          to="/about"
          className="site-nav__link"
          activeClassName="site-nav__link--active"
          onClick={!!this.logClick && this.logClick.bind(this, 'mainNav.about')}
        >
          <Translate content="siteNav.about" />
        </Link>{' '}
        <Link
          to="/talk"
          className="site-nav__link"
          activeClassName="site-nav__link--active"
          onClick={!!this.logClick && this.logClick.bind(this, 'mainNav.talk')}
        >
          <Translate content="siteNav.talk" />
        </Link>{' '}
        <Link
          to="/notifications"
          className="site-nav__link"
          activeClassName="site-nav__link--active"
          onClick={!!this.logClick && this.logClick.bind(this, 'mainNav.notifications')}
        >
          <Translate content="siteNav.notifications" />
        </Link>{' '}
        <Link
          to="/collections"
          className="site-nav__link"
          activeClassName="site-nav__link--active"
          onClick={!!this.logClick && this.logClick.bind(this, 'mainNav.collect')}
        >
          <Translate content="siteNav.collect" />
        </Link>{' '}
        <Link
          to="/lab"
          className="site-nav__link"
          activeClassName="site-nav__link--active"
          onClick={!!this.logClick && this.logClick.bind(this, 'mainNav.lab')}
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
            onClick={!!this.logClick && this.logClick.bind(this, 'mainNav.admin')}
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
            >• • •</span>
          }
        >
          <a
            href="http://daily.zooniverse.org/"
            className="site-nav__link"
            activeClassName="site-nav__link--active"
            target="_blank"
            onClick={!!this.logClick && this.logClick.bind(this, 'mainNav.daily', 'globe-menu')}
          >
            <Translate content="siteNav.daily" />
          </a>
          <br />
          <a
            href="http://blog.zooniverse.org/"
            className="site-nav__link"
            activeClassName="site-nav__link--active"
            target="_blank"
            onClick={!!this.logClick && this.logClick.bind(this, 'mainNav.blog', 'globe-menu')}
          >
            <Translate content="siteNav.blog" />
          </a>
        </TriggeredModalForm>
      </span>
    );
  },

  render() {
    const logo = <ZooniverseLogo width="1.8em" height="1.8em" style={{ margin: '-0.4em 0' }} />;

    return (
      <nav className="site-nav">
        <IndexLink
          to="/"
          className="site-nav__link"
          activeClassName="site-nav__link--active"
          onClick={!!this.logClick && this.logClick.bind(this, 'logo')}
        >
          {!!this.props.onToggle ? 'Home' : logo}
        </IndexLink>{' '}

        {this.renderMainLinks()}{' '}

        {!!this.props.user ? <AccountBar user={this.props.user} /> : <LoginBar />}

        {!!this.props.onToggle &&
          <button
            type="button"
            className="secret-button site-nav__reveal-toggle"
            style={{ lineHeight: 0 }}
            onClick={this.props.onToggle}
          >{logo}</button>}
      </nav>
    );
  },
});

export default SiteNav;
