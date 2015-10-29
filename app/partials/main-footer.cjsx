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
      projectBuilder: 'Build a Project'
      howToGuide: 'How to Build'
      projectBuilderPolicies: 'Project Policies'
    about:
      title: 'About'
      aboutUs: 'About Us'
      ourTeam: 'Our Team'
      education: 'Education'
      publications: 'Publications'
    talk:
      title: 'Talk'
      zooTalk: 'Zooniverse Talk'
      daily: 'Daily Zooniverse'
      blog: 'Blog'
    boilerplate:
      contact: 'Contact Us'
      jobs: 'Jobs'
      privacyPolicy: 'Privacy policy'

AdminToggle = React.createClass
  displayName: 'AdminToggle'

  getInitialState: ->
    adminFlag = localStorage.getItem('adminFlag') || undefined
    apiClient.update 'params.admin': adminFlag

    checked: if adminFlag then adminFlag else false

  componentDidMount: ->
    apiClient.listen 'change', @handleClientChange

  componentWillUnmount: ->
    apiClient.stopListening 'change', @handleClientChange

  handleClientChange: ->
    checked = apiClient.params.admin ? false

    unless @state.checked is checked
      if checked
        localStorage.setItem 'adminFlag', checked
      else
        localStorage.removeItem 'adminFlag'

      @setState {checked}

  toggleAdminMode: (e) ->
    apiClient.update 'params.admin': if e.target.checked
      true
    else
      undefined

  render: ->
    classes = 'admin-toggle ' + (if @state.checked then 'in-admin-mode' else '')
    <label className={classes}>
      <input type="checkbox" checked={@state.checked} onChange={@toggleAdminMode} />{' '}
      <Translate content="footer.adminMode" />
    </label>

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
          {if @props.user?.admin
            <AdminToggle />}
        </div>
        <nav className="site-map">
          <div className="site-map-section">
            <Translate component="h6" content="footer.discover.title" />
            <Link to="/projects"><Translate content="footer.discover.projectList" /></Link>
            <Link to="/collections"><Translate content="footer.discover.collectionList" /></Link>
            <Link to="/lab"><Translate content="footer.discover.projectBuilder" /></Link>
            <Link to="/lab-how-to"><Translate content="footer.discover.howToGuide" /></Link>
            <Link to="/lab-policies"><Translate content="footer.discover.projectBuilderPolicies" /></Link>
          </div>
          <div className="site-map-section">
            <Translate component="h6" content="footer.about.title" />
            <Link to="/about"><Translate content="footer.about.aboutUs" /></Link>
            <Link to="/about/education"><Translate content="footer.about.education" /></Link>
            <Link to="/about/team"><Translate content="footer.about.ourTeam" /></Link>
            <Link to="/about/publications"><Translate content="footer.about.publications" /></Link>
            <Link to="/about/contact"><Translate content="footer.boilerplate.contact" /></Link>
          </div>
          <div className="site-map-section">
            <Translate component="h6" content="footer.talk.title" />
            <Link to="talk"><Translate content="footer.talk.zooTalk" /></Link>
            <a href="http://daily.zooniverse.org/" target="_blank"><Translate content="footer.talk.daily" /></a>
            <a href="http://blog.zooniverse.org/" target="_blank"><Translate content="footer.talk.blog" /></a>
          </div>
          <div className="site-map-section social-media">
            <a href="https://www.facebook.com/therealzooniverse" target="_blank"><i className="fa fa-facebook"></i></a>
            <a href="https://twitter.com/the_zooniverse" target="_blank"><i className="fa fa-twitter"></i></a>
            <a href="https://plus.google.com/+ZooniverseOrgReal" target="_blank"><i className="fa fa-google-plus"></i></a>
          </div>

        </nav>
      </div>
      <div className="footer-sole">
        <div className="centered-grid footer-sole-links">
          <Link to="privacy"><Translate content="footer.boilerplate.privacyPolicy" /></Link>
          <i className="fa fa-ellipsis-v footer-sole-links-separator"></i>
          <a href="http://jobs.zooniverse.org/"><Translate content="footer.boilerplate.jobs" /></a>
        </div>
      </div>
    </footer>
