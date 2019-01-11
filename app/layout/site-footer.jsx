import counterpart from 'counterpart';
import Translate from 'react-translate-component';
import PropTypes from 'prop-types';
import React from 'react';
import ZooniverseLogotype from '../partials/zooniverse-logotype';
import AdminOnly from '../components/admin-only';
import AdminToggle from './admin-toggle';
import { Link, IndexLink } from 'react-router';


counterpart.registerTranslations('en', {
  footer: {
    discover: {
      projectList: 'Projects',
      collectionList: 'Collections',
      projectBuilder: 'Build a Project',
      howToGuide: 'How to Build',
      projectBuilderPolicies: 'Project Policies',
      faq: 'FAQ',
    },
    about: {
      aboutUs: 'About Us',
      ourTeam: 'Our Team',
      education: 'Education',
      publications: 'Publications',
      acknowledgements: 'Acknowledgements'
    },
    talk: {
      zooTalk: 'Zooniverse Talk',
      daily: 'Daily Zooniverse',
      blog: 'Blog',
    },
    boilerplate: {
      contact: 'Contact Us',
      jobs: 'Jobs',
      privacyPolicy: 'Privacy Policy',
      status: 'System Status',
      security: 'Security',
    },
  },
});

class AppFooter extends React.Component {
  static contextTypes = {
    geordi: PropTypes.object,
  };

  static propTypes = {
    user: PropTypes.shape({
      admin: PropTypes.bool,
    }),
  };

  logMenuClick = (linkName) => {
    !!this.context.geordi && this.context.geordi.logEvent({
      type: 'footer-menu',
      relatedID: linkName,
    });
  };

  loggableLink = (aLink, linkSymbolicName) => {
    return React.cloneElement(aLink, {
      onClick: this.logMenuClick.bind(this, linkSymbolicName),
    });
  };

  render() {
    return (
      <div className="app-footer">
        <div className="app-footer__upper">
          <div className="app-footer__section app-footer__brand">
            <IndexLink to="/">
              <ZooniverseLogotype />
            </IndexLink>
            <br />
            <AdminOnly>
              <AdminToggle />
            </AdminOnly>
          </div>

          <nav className="app-footer__section app-footer__nav-lists">
            <ul className="app-footer__nav-list">
              <li>
                {this.loggableLink(<Link to="/projects">
                  <Translate content="footer.discover.projectList" />
                </Link>, 'footer.discover.projectList')}
              </li>
              <li>
                {this.loggableLink(<Link to="/collections">
                  <Translate content="footer.discover.collectionList" />
                </Link>, 'footer.discover.collectionList')}
              </li>
              <li>
                {this.loggableLink(<Link to="/lab">
                  <Translate content="footer.discover.projectBuilder" />
                </Link>, 'footer.discover.projectBuilder')}
              </li>
              <li>
                {this.loggableLink(<a href="https://help.zooniverse.org/getting-started">
                  <Translate content="footer.discover.howToGuide" />
                </a>, 'footer.discover.howToGuide')}
              </li>
              <li>
                {this.loggableLink(<a href="https://help.zooniverse.org/getting-started/lab-policies">
                  <Translate content="footer.discover.projectBuilderPolicies" />
                </a>, 'footer.discover.projectBuilderPolicies')}
              </li>
              <li>
                {this.loggableLink(<Link to="/about/faq">
                  <Translate content="footer.discover.faq" />
                </Link>, 'footer.discover.faq')}
              </li>
              {process.env.NODE_ENV !== 'production' &&
                <li>
                  <Link to="/dev/classifier">Dev Classifier</Link>
                </li>}
            </ul>

            <ul className="app-footer__nav-list">
              <li>
                {this.loggableLink(<Link to="/about">
                  <Translate content="footer.about.aboutUs" />
                </Link>, 'footer.about.aboutUs')}
              </li>
              <li>
                {this.loggableLink(<Link to="/get-involved/education">
                  <Translate content="footer.about.education" />
                </Link>, 'footer.about.education')}
              </li>
              <li>
                {this.loggableLink(<Link to="/about/team">
                  <Translate content="footer.about.ourTeam" />
                </Link>, 'footer.about.ourTeam')}
              </li>
              <li>
                {this.loggableLink(<Link to="/about/publications">
                  <Translate content="footer.about.publications" />
                </Link>, 'footer.about.publications')}
              </li>
              <li>
                {this.loggableLink(<Link to="/about/acknowledgements">
                    <Translate content="footer.about.acknowledgements" />
                    </Link>, 'footer.about.acknowledgements')}
              </li>
              <li>
                {this.loggableLink(<Link to="/about/contact">
                  <Translate content="footer.boilerplate.contact" />
                </Link>, 'footer.boilerplate.contact')}
              </li>
            </ul>

            <ul className="app-footer__nav-list">
              <li>
                {this.loggableLink(<Link to="/talk">
                  <Translate content="footer.talk.zooTalk" />
                </Link>, 'footer.talk.zooTalk')}
              </li>
              <li>
                <a href="http://daily.zooniverse.org/" target="_blank">
                  <Translate content="footer.talk.daily" />
                </a>
              </li>
              <li>
                <a href="http://blog.zooniverse.org/" target="_blank">
                  <Translate content="footer.talk.blog" />
                </a>
              </li>
            </ul>

            <ul className="app-footer__nav-list app-footer__nav-list--social">
              <li>
                <a href="https://www.facebook.com/therealzooniverse" target="_blank">
                  <i className="fa fa-facebook fa-fw"></i>
                </a>{' '}
              </li>
              <li>
                <a href="https://twitter.com/the_zooniverse" target="_blank">
                  <i className="fa fa-twitter fa-fw"></i>
                </a>{' '}
              </li>
              <li>
                <a href="https://plus.google.com/+ZooniverseOrgReal" target="_blank">
                  <i className="fa fa-google-plus fa-fw"></i>
                </a>{' '}
              </li>
            </ul>
          </nav>
        </div>

        <div className="app-footer__sole">
          {this.loggableLink(<Link to="/privacy">
            <Translate content="footer.boilerplate.privacyPolicy" />
          </Link>, 'footer.boilerplate.privacyPolicy')}{' '}
          <i className="fa fa-ellipsis-v fa-fw"></i>{' '}
          <a href="http://jobs.zooniverse.org/">
            <Translate content="footer.boilerplate.jobs" />
          </a>{' '}
          <i className="fa fa-ellipsis-v fa-fw"></i>{' '}
          <a href="https://status.zooniverse.org/">
            <Translate content="footer.boilerplate.status" />
          </a>{' '}
          <i className="fa fa-ellipsis-v fa-fw"></i>{' '}
          {this.loggableLink(<Link to="/security">
            <Translate content="footer.boilerplate.security" />
          </Link>, 'footer.boilerplate.security')}
        </div>
      </div>
    );
  }
}

export default AppFooter;
