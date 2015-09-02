React = require 'react'
counterpart = require 'counterpart'
Translate = require 'react-translate-component'
{Link} = require 'react-router'
ZooniverseLogoType = require '../../partials/zooniverse-logotype'
alert = require '../../lib/alert'
LoginDialog = require '../../partials/login-dialog'
{Markdown} = require 'markdownz'

counterpart.registerTranslations 'en',
  landing:
    title: "Zooniverse Project Builder"
    content: "Anyone can build a Zooniverse project. Just upload your data and choose the tasks you want the volunteers to do. To find out more, read our [How to Build a Project documentation](/lab-how-to), or click the button below to get started."
    buttons:
      getStarted: "Get started!"
      signIn: "Sign in"
      backToProjects: "Back to projects"

module.exports = React.createClass
  displayName: "ProjectBuilderLandingPage"

  render: ->
    <div className="landing-page">
      <ZooniverseLogoType />
      <h3 className="landing-title"><Translate content="landing.title" /></h3>
      <div className="landing-tagline"><Markdown>{counterpart "landing.content"}</Markdown></div>
      <button type="button" className="call-to-action standard-button landing-button" onClick={@showLoginDialog.bind this, 'sign-in'}>
          <Translate content="landing.buttons.signIn" />
        </button>
      <Link to="projects" className="call-to-action standard-button landing-button"><Translate content="landing.buttons.backToProjects" /></Link>
    </div>

  showLoginDialog: (which) ->
    alert (resolve) ->
      <LoginDialog which={which} onSuccess={resolve} />
