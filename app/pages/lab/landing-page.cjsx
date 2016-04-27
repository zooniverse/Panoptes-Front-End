React = require 'react'
counterpart = require 'counterpart'
Translate = require 'react-translate-component'
{Link} = require 'react-router'
ZooniverseLogoType = require '../../partials/zooniverse-logotype'
alert = require '../../lib/alert'
LoginDialog = require '../../partials/login-dialog'
{Markdown} = (require 'markdownz').default

counterpart.registerTranslations 'en',
  labLanding:
    title: "Zooniverse Project Builder"
    content: "Anyone can build a Zooniverse project. Just upload your data and choose the tasks you want the volunteers to do. To find out more, read our [How to Build a Project documentation](/lab-how-to), or click the button below to get started."
    buttons:
      getStarted: "Get started!"
      signIn: "Sign in"
      backToProjects: "Back to projects"
    links:
      heading: 'Quick Links'
      buildHelp: 'Project Builder Help'
      policies: 'Project Builder Policies'
      bestPractices: 'Best Practices Guide'
      buildTalk: 'Project Builder Talk'

module.exports = React.createClass
  displayName: 'ProjectBuilderLandingPage'

  componentDidMount: ->
    document.documentElement.classList.add 'on-secondary-page'
    document.documentElement.classList.add 'on-landing-page'

  componentWillUnmount: ->
    document.documentElement.classList.remove 'on-secondary-page'
    document.documentElement.classList.remove 'on-landing-page'

  render: ->
    <div className="landing-page">
      <ZooniverseLogoType />

      <h3 className="landing-title">
        <Translate content="labLanding.title" />
      </h3>

      <div className="landing-tagline">
        <Markdown>{counterpart "labLanding.content"}</Markdown>
      </div>

      <div className="landing-actions">
        <div className="landing-buttons">
          <button type="button" className="call-to-action standard-button landing-button" onClick={@showLoginDialog.bind this, 'sign-in'}>
            <Translate content="labLanding.buttons.signIn" />
          </button>

          <Link to="/projects" className="call-to-action standard-button landing-button">
            <Translate content="labLanding.buttons.backToProjects" />
          </Link>
        </div>

        <div className="landing-links">
          <p className="heading"><Translate content="labLanding.links.heading" /></p>
          <Link to="/lab-how-to"><Translate content="labLanding.links.buildHelp" /></Link>
          <Link to="/lab-policies"><Translate content="labLanding.links.policies"></Translate></Link>
          <Link to="/lab-best-practices/introduction"><Translate content="labLanding.links.bestPractices" /></Link>
          <Link to="/talk/18"><Translate content="labLanding.links.buildTalk" /></Link>
        </div>
      </div>
    </div>

  showLoginDialog: (which) ->
    alert (resolve) ->
      <LoginDialog which={which} onSuccess={resolve} />
