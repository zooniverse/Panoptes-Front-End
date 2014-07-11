# @cjsx React.DOM

React = require 'react'
currentUserActions = require '../actions/current-user'
ChildRouter = require 'react-child-router'
SignInForm = require '../partials/sign-in-form'
Translator = require 'react-translator'
InPlaceForm = require '../components/in-place-form'

Translator.setStrings
  signIn:
    withZooniverse: 'Sign in with your Zooniverse account'
    whyHaveAccount: 'Signed-in volunteers lorem ipsum dolor sit amet blah blah blah.'

module.exports = React.createClass
  displayName: 'SignInPage'

  getInitialState: ->
    needsToRegister: false

  toggleNeedsAccount: (e) ->
    @setState needsToRegister: not @state.needsToRegister

  render: ->
    <ChildRouter className="sign-in-page normal-content">
      <Translator tag="h1">signIn.withZooniverse</Translator>
      <Translator tag="p">signIn.whyHaveAccount</Translator>

      <nav>
        <a href="#/sign-in">Sign in</a> | <a href="#/sign-in/register">Register</a>
      </nav>

      <div hash="#/sign-in" className="has-columns">
        <SignInForm className="primary-column" />

        <div className="oauth-providers">
          <p>Or sign in with another service</p>
          <div><button><Translator>signIn.withFacebook</Translator></button></div>
          <div><button><Translator>signIn.withTwitter</Translator></button></div>
          <div><button><Translator>signIn.withGoogle</Translator></button></div>
        </div>
      </div>

      <div hash="#/sign-in/register">
        <form>
          <h1>Register a new Zooniverse account</h1>

          <p>
            <label>
              User name<br />
              <input type="text" name="login" />
            </label>
          </p>

          <p>
            <label>
              Password<br />
              <input type="password" />
            </label>
          </p>

          <p>
            <label>
              <input type="checkbox" checked={@state.needsToRegister} onClick={@toggleNeedsAccount} />
              I need to register
            </label>
          </p>
          <p>
            <label>
              Confirm password<br />
              <input type="password" name="confirm_password" />
            </label>
          </p>

          <p>
            <label>
              Your real name<br />
              <input type="text" name="real_name" /><br />
              <small>Optional; we’ll use this to acknowledge your work in scientific papers, posters, etc.</small>
            </label>
          </p>

          <p><button type="submit">Sign up</button></p>
        </form>

        <hr />

        <div className="oauth-providers">
          <p>Or sign in with another service</p>
          <div><button><Translator>signIn.withFacebook</Translator></button></div>
          <div><button><Translator>signIn.withTwitter</Translator></button></div>
          <div><button><Translator>signIn.withGoogle</Translator></button></div>
        </div>
      </div>
    </ChildRouter>
