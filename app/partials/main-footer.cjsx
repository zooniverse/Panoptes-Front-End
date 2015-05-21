counterpart = require 'counterpart'
React = require 'react'
Translate = require 'react-translate-component'
{Link} = require 'react-router'
ZooniverseLogoType = require './zooniverse-logotype'

counterpart.registerTranslations 'en',
  footer:
    discover:
      title: 'Discover'
      projectList: 'Project List'
    learn:
      title: 'Learn'
      aboutUs: 'About Us'
      ourTeam: 'Our Team'
      education: 'Education'
      privacyPolicy: 'Privacy policy'
    talk:
      title: 'Talk'
      zooTalk: 'Zooniverse Talk'
      otherTalk: 'Other Talk'

module.exports = React.createClass
  displayName: 'MainFooter'

  render: ->
    <footer className="main-footer">
      <div className="centered-grid main-footer-flex">
        <div className="main-logo">
          <Link to="home" className="main-logo-link">
            <ZooniverseLogoType />
          </Link>
        </div>
        <nav className="site-map">
          <div className="site-map-section">
            <Translate component="h6" content="footer.discover.title" />
            <Link to="projects"><Translate content="footer.discover.projectList" /></Link>
          </div>
          <div className="site-map-section">
            <Translate component="h6" content="footer.learn.title" />
            <a><Translate content="footer.learn.aboutUs" /></a>
            <a><Translate content="footer.learn.ourTeam" /></a>
            <a><Translate content="footer.learn.education" /></a>
            <Link to="privacy"><Translate content="footer.learn.privacyPolicy" /></Link>
          </div>
          <div className="site-map-section">
            <Translate component="h6" content="footer.talk.title" />
            <Link to="talk"><Translate content="footer.talk.zooTalk" /></Link>
            <a><Translate content="footer.talk.otherTalk" /></a>
          </div>
        </nav>
        <div className="social-media">
          <a href="https://www.facebook.com/therealzooniverse" target="_blank"><i className="fa fa-facebook"></i></a>
          <a href="https://twitter.com/the_zooniverse" target="_blank"><i className="fa fa-twitter"></i></a>
          <a href="https://plus.google.com/+ZooniverseOrgReal" target="_blank"><i className="fa fa-google-plus"></i></a>
        </div>
      </div>
    </footer>
