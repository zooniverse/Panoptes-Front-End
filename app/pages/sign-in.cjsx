counterpart = require 'counterpart'
React = require 'react'
TitleMixin = require '../lib/title-mixin'
Translate = require 'react-translate-component'
{Link} = require 'react-router'

counterpart.registerTranslations 'en',
  signIn:
    withZooniverse: 'Sign in with your Zooniverse account'
    whyHaveAccount: 'Signed-in volunteers can keep track of their work and will be credited in any resulting publications.'
    signIn: 'Sign in'
    register: 'Register'
    orThirdParty: 'Or sign in with another service'
    withFacebook: 'Sign in with Facebook'
    withTwitter: 'Sign in with Twitter'
    withGoogle: 'Sign in with Google'

module.exports = React.createClass
  displayName: 'SignInPage'

  mixins: [TitleMixin]

  title: 'Sign in/register'

  render: ->
    <div className="sign-in-page content-container">
      <Translate component="h1" content="signIn.withZooniverse" />
      <Translate component="p" content="signIn.whyHaveAccount" />

      <div className="columns-container">
        <div className="tabbed-content column" data-side="top">
          <nav className="tabbed-content-tabs">
            <Link to="sign-in" className="tabbed-content-tab"><Translate content="signIn.signIn" /></Link>
            <Link to="register" className="tabbed-content-tab"><Translate content="signIn.register" /></Link>
          </nav>

          {@props.children}
        </div>

        <hr />

        <div className="oauth-providers">
          <Translate content="signIn.orThirdParty" />
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
