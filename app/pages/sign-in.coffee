# @cjsx React.DOM

React = require 'react'
TabbedContent = require '../components/tabbed-content'
ChildRouter = require 'react-child-router'
Translator = require 'react-translator'

{Tab} = TabbedContent

Translator.setStrings
  signIn:
    withFacebook: 'Sign in with Facebook'
    withTwitter: 'Sign in with Twitter'
    withGoogle: 'Sign in with Google'

module.exports = React.createClass
  displayName: 'SignInPage'

  getInitialState: ->
    needsToRegister: false

  toggleNeedsAccount: (e) ->
    @setState needsToRegister: not @state.needsToRegister

  render: ->
    <ChildRouter className="sign-in-page normal-content">
      <div hash="#/sign-in" className="has-columns">
        <form className="primary-column">
          <h1>Sign in to your Zooniverse account</h1>

          <p>Signed-in volunteers lorem ipsum dolor sit amet blah blah blah.</p>

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

          <p><button type="submit">Sign in</button></p>
        </form>

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
