counterpart = require 'counterpart'
React = require 'react'
Translate = require 'react-translate-component'
{Link, RouteHandler} = require 'react-router'

counterpart.registerTranslations 'en',
  signIn:
    withZooniverse: 'Sign in with your Zooniverse account'
    whyHaveAccount: 'Signed-in volunteers lorem ipsum dolor sit amet blah blah blah.'
    withFacebook: 'Sign in with Facebook'
    withTwitter: 'Sign in with Twitter'
    withGoogle: 'Sign in with Google'

module.exports = React.createClass
  displayName: 'SignInPage'

  render: ->
    <div className="sign-in-page content-container">
      <Translate component="h1" content="signIn.withZooniverse" />
      <Translate component="p" content="signIn.whyHaveAccount" />

      <div className="columns-container">
        <div className="tabbed-content column" data-side="top">
          <nav className="tabbed-content-tabs">
            <Link to="sign-in" className="tabbed-content-tab">Sign in</Link>
            <Link to="register" className="tabbed-content-tab">Register</Link>
          </nav>

          <RouteHandler />
        </div>

        <hr />

        <div className="oauth-providers">
          <div>Or sign in with another service</div>
          <br />
          <div>
            <button><Translate content="signIn.withFacebook" /></button>
          </div>
          <div>
            <button><Translate content="signIn.withTwitter" /></button>
          </div>
          <div>
            <button><Translate content="signIn.withGoogle" /></button>
          </div>
        </div>
      </div>
    </div>
