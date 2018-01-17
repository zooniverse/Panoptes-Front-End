counterpart = require 'counterpart'
Translate = require 'react-translate-component'
React = require 'react'
createReactClass = require 'create-react-class'
alert = require('../lib/alert').default
LoginDialog = require './login-dialog'

counterpart.registerTranslations 'en',
  signInPrompt:
    explanation: 'Signing in allows you to participate in discussions, allows us to give you credit for your work, and helps the science team make the best use of the data you provide.'
    noThanks: 'No thanks'
    register: 'Register'
    signIn: 'Sign in'

module.exports = createReactClass
  displayName: 'SignInPrompt'

  getDefaultProps: ->
    project: {}
    onChoose: Function.prototype # No-op

  componentDidMount: ->
    @props.contextRef?.geordi?.logEvent type: 'please-register'

  render: ->
    <div className="content-container">
      {@props.children}
      <p>
        <Translate content="signInPrompt.explanation" />
      </p>
      <p className="columns-container spread inline">
        <span>
          <button type="button" className="minor-button" onClick={@dismiss}>
            <Translate content="signInPrompt.noThanks" />
          </button>
        </span>
        <span>
          <button type="button" className="standard-button" autoFocus onClick={@signIn}>
            <Translate content="signInPrompt.signIn" />
          </button>{' '}
          <button type="button" className="standard-button" onClick={@register}>
            <Translate content="signInPrompt.register" />
          </button>
        </span>
      </p>
    </div>

  dismiss: (e)->
    @props.contextRef?.geordi?.logEvent type: 'register-no-thanks'
    @props.onChoose e

  signIn: (e) ->
    @props.contextRef?.geordi?.logEvent type: 'register-sign-in'
    @props.onChoose e
    alert (resolve) =>
      <LoginDialog which="sign-in" project={@props.project} onSuccess={resolve} />

  register: (e) ->
    @props.contextRef?.geordi?.logEvent type: 'register-register'
    @props.onChoose e
    alert (resolve) =>
      <LoginDialog which="register" project={@props.project} onSuccess={resolve} />
