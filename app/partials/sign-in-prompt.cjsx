React = require 'react'
alert = require '../lib/alert'
LoginDialog = require './login-dialog'

module.exports = React.createClass
  displayName: 'SignInPrompt'

  getDefaultProps: ->
    project: {}
    onChoose: Function.prototype # No-op

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

  dismiss: ->
    @props.onChoose()

  signIn: ->
    @props.onChoose()
    alert (resolve) =>
      <LoginDialog which="sign-in" project={@props.project} onSuccess={resolve} />

  register: ->
    @props.onChoose()
    alert (resolve) =>
      <LoginDialog which="register" project={@props.project} onSuccess={resolve} />
