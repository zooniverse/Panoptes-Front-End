counterpart = require 'counterpart'
React = require 'react'
Translate = require 'react-translate-component'
{Link} = require 'react-router'
ZooniverseLogoType = require './zooniverse-logotype'
apiClient = require '../api/client'

counterpart.registerTranslations 'en',
  footer:
    adminMode: 'Admin mode'
    discover:
      title: 'Projects'
      projectList: 'Projects'
      collectionList: 'Collections'
    learn:
      title: 'About'
      aboutUs: 'About Us'
      ourTeam: 'Our Team'
      education: 'Education'
      publications: 'Publications'
      contact: 'Contact Us'
      privacyPolicy: 'Privacy policy'
    talk:
      title: 'Talk'
      zooTalk: 'Zooniverse Talk'
      daily: 'Daily Zooniverse'
      blog: 'Blog'

AdminToggle = React.createClass
  getInitialState: ->
    checked: false

  componentDidMount: ->
    apiClient.listen 'change', @handleClientChange

  componentWillUnmount: ->
    apiClient.stopListening 'change', @handleClientChange

  handleClientChange: ->
    checked = apiClient.params.admin ? false
    unless @state.checked is checked
      @setState {checked}

  render: ->
    <label>
      <input type="checkbox" checked={@state.checked} onChange={@toggleAdminMode} />{' '}
      <Translate content="footer.adminMode" />
    </label>

  toggleAdminMode: (e) ->
    apiClient.update 'params.admin': if e.target.checked
      true
    else
      undefined

module.exports = React.createClass
  displayName: 'MainFooter'

  render: ->
    <footer className="main-footer">
      <div className="centered-grid main-footer-flex">
        <div className="main-logo">
          <Link to="home" className="main-logo-link">
            <ZooniverseLogoType />
          </Link>
          <br />
          {if @props.user?.admin or @props.user?.id is '3' # brian-testing
            <AdminToggle />}
        </div>
        <nav className="site-map">
          <div className="site-map-section">
            <Translate component="h6" content="footer.discover.title" />
            <Link to="projects"><Translate content="footer.discover.projectList" /></Link>
            <Link to="collections"><Translate content="footer.discover.collectionList" /></Link>
          </div>
          <div className="site-map-section">
            <Translate component="h6" content="footer.learn.title" />
            <Link to="about"><Translate content="footer.learn.aboutUs" /></Link>
            <Link to="about-team"><Translate content="footer.learn.ourTeam" /></Link>
            <Link to="about-publications"><Translate content="footer.learn.publications" /></Link>
            <Link to="about-contact"><Translate content="footer.learn.contact" /></Link>
            <Link to="privacy"><Translate content="footer.learn.privacyPolicy" /></Link>
            <a href="http://jobs.zooniverse.org/">Jobs</a>
          </div>
          <div className="site-map-section">
            <Translate component="h6" content="footer.talk.title" />
            <Link to="talk"><Translate content="footer.talk.zooTalk" /></Link>
            <a href="http://daily.zooniverse.org/" target="_blank"><Translate content="footer.talk.daily" /></a>
            <a href="http://blog.zooniverse.org/" target="_blank"><Translate content="footer.talk.blog" /></a>
          </div>
        </nav>
        <div className="social-media">
          <a href="https://www.facebook.com/therealzooniverse" target="_blank"><i className="fa fa-facebook"></i></a>
          <a href="https://twitter.com/the_zooniverse" target="_blank"><i className="fa fa-twitter"></i></a>
          <a href="https://plus.google.com/+ZooniverseOrgReal" target="_blank"><i className="fa fa-google-plus"></i></a>
        </div>
      </div>
    </footer>
