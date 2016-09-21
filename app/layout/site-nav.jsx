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
import SiteSubnav from './site-subnav';

import style from './site-nav.styl';
void style;

const MAX_MOBILE_WIDTH = 875;
const ZOO_LOGO = <ZooniverseLogo width="1.8em" height="1.8em" style={{ verticalAlign: '-0.5em' }} />;
const HAMBURGER_MENU = <span style={{ display: 'inline-block', transform: 'scale(2.5, 2)' }}>≡</span>;

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
  },
});

const SiteNav = React.createClass({
  resizeTimeout: NaN,

  contextTypes: {
    initialLoadComplete: React.PropTypes.bool,
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
    removeEventListener('resize', this.handleResize);
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
        {!!this.state.isMobile &&
        <Link
          to="/"
          className="site-nav__link"
          activeClassName="site-nav__link--active"
          onClick={!!this.logClick ? this.logClick.bind(this, 'mainNav.home') : null}
        >
          <Translate content="siteNav.home" />
        </Link>
        }
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
          <Translate content="siteNav.lab" />
        </Link>{' '}

        <AdminOnly whenActive>
          <Link
            to={"/admin"}
            className="site-nav__link"
            activeClassName="site-nav__link--active"
            onClick={!!this.logClick ? this.logClick.bind(this, 'mainNav.admin') : null}
          >
            <Translate content="siteNav.admin" />
          </Link>
        </AdminOnly>

        <SiteSubnav isMobile={this.state.isMobile}>
          <span>
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
          </span>
        </SiteSubnav>
      </span>
    );
  },

  renderMobileLinksMenu() {
    return (
      <TriggeredModalForm
        className="site-nav__modal site-nav__reveal-toggle"
        trigger={
          <span
            className="site-nav__link"
            activeClassName="site-nav__link--active"
            title="Site navigation"
            aria-label="Site navigation"
          >
            {HAMBURGER_MENU}
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
    const label = !!this.props.visible ? 
      React.cloneElement(ZOO_LOGO, {title: "Hide navigation menu"}) : 
      HAMBURGER_MENU;

    return (
      <nav className="site-nav">
        <IndexLink
          to="/"
          className="site-nav__link"
          activeClassName="site-nav__link--active"
          onClick={!!this.logClick ? this.logClick.bind(this, 'logo') : null}
        >
          {!this.state.isMobile && !!this.props.onToggle ? <Translate component="strong" content="siteNav.home" /> : ZOO_LOGO}
          </IndexLink>

        {!this.state.isMobile && this.renderLinks()}

        {!this.context.initialLoadComplete &&
          <span className="site-nav__link">
            <i className="fa fa-spinner fa-spin fa-fw"></i>
          </span>}

        {this.context.initialLoadComplete && (!!this.context.user ? <AccountBar params={this.props.params} /> : <LoginBar />)}

        {!!this.props.onToggle && !this.state.isMobile &&
          <button
            type="button"
            className="secret-button site-nav__reveal-toggle"
            onClick={this.props.onToggle}
            >{label}</button>}

        {this.state.isMobile && this.renderMobileLinksMenu()}
      </nav>
    );
  },
});

export default SiteNav;
