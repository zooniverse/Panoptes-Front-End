React = require 'react'
alert = require '../lib/alert'
LoginDialog = require './login-dialog'

module.exports = React.createClass
  displayName: 'SignInPrompt'

  getDefaultProps: ->
    project: {}
    onChoose: Function.prototype # No-op

  componentDidMount: ->
    @props.contextRef?.geordi?.logEvent type: 'please-register'

  render: ->
    <div className="content-container">
      {@props.children}
      <p>Signing in allows you to participate in discussions, allows us to give you credit for your work, and helps the science team make the best use of the data you provide.</p>
      <p className="columns-container spread inline">
        <span>
          <button type="button" className="minor-button" onClick={@dismiss}>No thanks</button>
        </span>
        <span>
          <button type="button" className="standard-button" autoFocus onClick={@signIn}>Sign in</button>{' '}
          <button type="button" className="standard-button" onClick={@register}>Register</button>
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
