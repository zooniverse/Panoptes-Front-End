React = require 'react'
createReactClass = require 'create-react-class'
counterpart = require 'counterpart'
Translate = require 'react-translate-component'
{Link} = require 'react-router'
{Markdown} = require 'markdownz'
ZooniverseLogoType = require '../../partials/zooniverse-logotype'
alert = require('../../lib/alert').default
LoginDialog = require '../../partials/login-dialog'

counterpart.registerTranslations 'en',
  labLanding:
    title: "Zooniverse Project Builder"
    content: "Anyone can build a Zooniverse project. Just upload your data and choose the tasks you want the volunteers to do. To find out more, read our [How to Build a Project documentation](/help), or click the button below to get started."
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
      acknowledgements: 'Acknowledgements'
      glossary: 'Glossary'

module.exports = createReactClass
  displayName: 'ProjectBuilderLandingPage'

  render: ->
    <div className="landing-page on-landing-page">
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
          <a href="https://help.zooniverse.org"><Translate content="labLanding.links.buildHelp" /></a>
          <a href="https://help.zooniverse.org/getting-started/lab-policies"><Translate content="labLanding.links.policies"></Translate></a>
          <a href="https://help.zooniverse.org/best-practices"><Translate content="labLanding.links.bestPractices" /></a>
          <Link to="/about/acknowledgements"><Translate content="labLanding.links.acknowledgements" /></Link>
          <Link to="/talk/18"><Translate content="labLanding.links.buildTalk" /></Link>
          <a href="https://help.zooniverse.org/getting-started/glossary"><Translate content="labLanding.links.glossary" /></a>
        </div>
      </div>
    </div>

  showLoginDialog: (which) ->
    alert (resolve) ->
      <LoginDialog which={which} onSuccess={resolve} />
