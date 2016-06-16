counterpart = require 'counterpart'
React = require 'react'
Translate = require 'react-translate-component'
{IndexLink, Link} = require 'react-router'
ZooniverseLogoType = require './zooniverse-logotype'
apiClient = require 'panoptes-client/lib/api-client'

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
      privacyPolicy: 'Privacy Policy'
      status: 'System Status'
      security: 'Security'

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

  contextTypes:
    geordi: React.PropTypes.object

  logMenuClick: (linkName) ->
    @context.geordi?.logEvent
      type: 'footer-menu'
      relatedID: linkName

  loggableLink: (aLink, linkSymbolicName) ->
    React.cloneElement aLink,
      onClick: (@logMenuClick.bind this, linkSymbolicName),
      <Translate content="#{linkSymbolicName}" />

  render: ->
    <footer className="main-footer">
      <div className="centered-grid main-footer-flex">
        <div className="main-logo">
          <IndexLink to="/" className="main-logo-link">
            <ZooniverseLogoType />
          </IndexLink>
          <br />
          {if @props.user?.admin
            <AdminToggle />}
        </div>
        <nav className="site-map">
          <div className="site-map-section">
            <Translate component="h6" content="footer.discover.title" />
            {@loggableLink <Link to="/projects"/>, 'footer.discover.projectList'}
            {@loggableLink <Link to="/collections"/>, 'footer.discover.collectionList'}
            {@loggableLink <Link to="/lab"/>, 'footer.discover.projectBuilder'}
            {@loggableLink <Link to="/lab-how-to"/>, 'footer.discover.howToGuide'}
            {@loggableLink <Link to="/lab-policies"/>, 'footer.discover.projectBuilderPolicies'}
            {if process.env.NODE_ENV isnt 'production'
              <Link to="/dev/classifier">Dev Classifier</Link>}
          </div>
          <div className="site-map-section">
            <Translate component="h6" content="footer.about.title" />
            {@loggableLink <Link to="/about" />, 'footer.about.aboutUs'}
            {@loggableLink <Link to="/about/education" />, 'footer.about.education'}
            {@loggableLink <Link to="/about/team" />, 'footer.about.ourTeam'}
            {@loggableLink <Link to="/about/education" />, 'footer.about.education'}
            {@loggableLink <Link to="/about/contact" />, 'footer.boilerplate.contact'}
          </div>
          <div className="site-map-section">
            <Translate component="h6" content="footer.talk.title" />
            {@loggableLink <Link to="/talk" />, 'footer.talk.zooTalk'}
            <a href="http://daily.zooniverse.org/" target="_blank" onClick={@logMenuClick.bind this, 'footer.talk.daily'}><Translate content="footer.talk.daily" /></a>
            <a href="http://blog.zooniverse.org/" target="_blank" onClick={@logMenuClick.bind this, 'footer.talk.blog'}><Translate content="footer.talk.blog" /></a>
          </div>
          <div className="site-map-section social-media">
            <a href="https://www.facebook.com/therealzooniverse" target="_blank" onClick={@logMenuClick.bind this, 'footer.socialMedia.facebook'}><i className="fa fa-facebook"></i></a>
            <a href="https://twitter.com/the_zooniverse" target="_blank" onClick={@logMenuClick.bind this, 'footer.socialMedia.twitter'}><i className="fa fa-twitter"></i></a>
            <a href="https://plus.google.com/+ZooniverseOrgReal" target="_blank" onClick={@logMenuClick.bind this, 'footer.socialMedia.googlePlus'}><i className="fa fa-google-plus"></i></a>
          </div>
        </nav>
      </div>
      <div className="footer-sole">
        <div className="centered-grid footer-sole-links">
          {@loggableLink <Link to="/privacy" />, 'footer.boilerplate.privacyPolicy'}
          <i className="fa fa-ellipsis-v footer-sole-links-separator"></i>
          <a href="http://jobs.zooniverse.org/" onClick={@logMenuClick.bind this, 'footer.boilerplate.jobs'}><Translate content="footer.boilerplate.jobs" /></a>
          <i className="fa fa-ellipsis-v footer-sole-links-separator"></i>
          <a href="https://status.zooniverse.org/" onClick={@logMenuClick.bind this, 'footer.boilerplate.status'}><Translate content="footer.boilerplate.status" /></a>
          <i className="fa fa-ellipsis-v footer-sole-links-separator"></i>
          {@loggableLink <Link to="/security" />, 'footer.boilerplate.security'}
        </div>
      </div>
    </footer>
