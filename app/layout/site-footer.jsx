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
                <a href='https://www.zooniverse.org/about/faq'>
                  <Translate content="footer.discover.faq" />
                </a>
              </li>
              {process.env.NODE_ENV !== 'production' &&
                <li>
                  <Link to="/dev/classifier">Dev Classifier</Link>
                </li>}
            </ul>

            <ul className="app-footer__nav-list">
              <li>
                <a href='https://www.zooniverse.org/about'>
                  <Translate content="footer.about.aboutUs" />
                </a>
              </li>
              <li>
                <a href='https://www.zooniverse.org/get-involved/educate'>
                  <Translate content="footer.about.education" />
                </a>
              </li>
              <li>
                <a href='https://www.zooniverse.org/about/team'>
                  <Translate content="footer.about.ourTeam" />
                </a>
              </li>
              <li>
                <a href='https://www.zooniverse.org/about/publications'>
                  <Translate content="footer.about.publications" />
                </a>
              </li>
              <li>
                <a href='https://www.zooniverse.org/about#contact'>
                  <Translate content="footer.boilerplate.contact" />
                </a>
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
                <a
                  aria-label="Zooniverse Facebook"
                  href="https://www.facebook.com/therealzooniverse"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <i className="fa fa-facebook fa-fw"></i>
                </a>{' '}
              </li>
              <li>
                <a
                  aria-label="Zooniverse Twitter"
                  href="https://twitter.com/the_zooniverse"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <i className="fa fa-twitter fa-fw"></i>
                </a>{' '}
              </li>
              <li>
                <a
                  aria-label="Zooniverse Bluesky"
                  href="https://bsky.app/profile/zooniverse.bsky.social"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <i className='fa fa-fw'><svg viewBox="0 0 576 512" height="12px" width="12px" fill='#fff' style={{ opacity: '50%' }}><path d="M407.8 294.7c-3.3-.4-6.7-.8-10-1.3c3.4 .4 6.7 .9 10 1.3zM288 227.1C261.9 176.4 190.9 81.9 124.9 35.3C61.6-9.4 37.5-1.7 21.6 5.5C3.3 13.8 0 41.9 0 58.4S9.1 194 15 213.9c19.5 65.7 89.1 87.9 153.2 80.7c3.3-.5 6.6-.9 10-1.4c-3.3 .5-6.6 1-10 1.4C74.3 308.6-9.1 342.8 100.3 464.5C220.6 589.1 265.1 437.8 288 361.1c22.9 76.7 49.2 222.5 185.6 103.4c102.4-103.4 28.1-156-65.8-169.9c-3.3-.4-6.7-.8-10-1.3c3.4 .4 6.7 .9 10 1.3c64.1 7.1 133.6-15.1 153.2-80.7C566.9 194 576 75 576 58.4s-3.3-44.7-21.6-52.9c-15.8-7.1-40-14.9-103.2 29.8C385.1 81.9 314.1 176.4 288 227.1z"/></svg></i>
                </a>{' '}
              </li>
              <li>
                <a
                  aria-label="Zooniverse Instagram"
                  href="https://www.instagram.com/the.zooniverse/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <i className="fa fa-instagram fa-fw"></i>
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
