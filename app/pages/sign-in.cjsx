# @cjsx React.DOM

React = require 'react'
ChildRouter = {Link} = require 'react-child-router'
SignInForm = require '../partials/sign-in-form'
RegisterForm = require '../partials/register-form'
Translator = require 'react-translator'
InPlaceForm = require '../components/in-place-form'

Translator.setStrings
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
      <Translator tag="h1">signIn.withZooniverse</Translator>
      <Translator tag="p">signIn.whyHaveAccount</Translator>

      <div className="columns-container">
        <ChildRouter className="tabbed-content column" data-side="top">
          <nav className="tabbed-content-tabs">
            <Link href="#/sign-in" className="tabbed-content-tab">Sign in</Link>
            <Link href="#/sign-in/register" className="tabbed-content-tab">Register</Link>
          </nav>

          <div hash="#/sign-in" className="content-container">
            <SignInForm currentLogin={@props.currentLogin} loggingIn={@props.loggingIn} />
          </div>

          <div hash="#/sign-in/register" className="content-container">
            <RegisterForm currentLogin={@props.currentLogin} loggingIn={@props.loggingIn} />
          </div>
        </ChildRouter>

        <hr />

        <div className="oauth-providers">
          <div>Or sign in with another service</div>
          <br />
          <div>
            <button><Translator>signIn.withFacebook</Translator></button>
          </div>
          <div>
            <button><Translator>signIn.withTwitter</Translator></button>
          </div>
          <div>
            <button><Translator>signIn.withGoogle</Translator></button>
          </div>
        </div>
      </div>
    </div>
