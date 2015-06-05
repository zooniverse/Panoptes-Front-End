React = require 'react'
auth = require '../api/auth'
apiClient = require '../api/client'
alert = require '../lib/alert'
LoginDialog = require '../partials/login-dialog'

module.exports = React.createClass
  displayName: 'ResetPasswordPage'

  getDefaultProps: ->
    query: {}

  getInitialState: ->
    inProgress: false
    resetSuccess: false
    resetError: null
    emailSuccess: false
    emailError: null

  render: ->
    <div className="content-container">
      {if @props.query?.reset_password_token?
        <form onSubmit={@handleResetSubmit}>
          <p>Go ahead and enter a new password, then you can get back to doing some science.</p>

          <p>
            New password:<br />
            <input ref="password" type="password" className="standard-input" size="20" />
          </p>

          <p>
            Again, to confirm:<br />
            <input ref="confirmation" type="password" className="standard-input" size="20" />
          </p>

          <p>
            <button type="submit" className="standard-button">Submit</button>{' '}
            {if @state.inProgress
              <i className="fa fa-spinner fa-spin form-help"></i>
            else if @state.resetSuccess
              <i className="fa fa-check-circle form-help success"></i>
            else if @state.resetError?
              <small className="form-help error">{@state.resetError.toString()}</small>}
          </p>
        </form>

      else
        <form onSubmit={@handleEmailSubmit}>
          <p><strong>So, you’ve forgotten your password.</strong></p>
          <p>It happens to the best of us. Just enter your email address here and we’ll send you a link you can follow to reset it.</p>
          <p><input ref="email" type="email" className="standard-input" defaultValue={@props.query?.email} size="50" /></p>
          <p>
            <button type="submit" className="standard-button">Submit</button>{' '}
            {if @state.inProgress
              <i className="fa fa-spinner fa-spin form-help"></i>
            else if @state.emailSuccess
              <i className="fa fa-check-circle form-help success"></i>
            else if @state.emailError?
              <small className="form-help error">{@state.emailError.toString()}</small>}
          </p>
          {if @state.emailSuccess
            <p>We’ve just sent you an email with a link to reset your password.</p>}
        </form>}
    </div>

  handleResetSubmit: (e) ->
    e.preventDefault()

    @setState
      inProgress: true
      resetSuccess: false
      resetError: null

    token = @props.query.reset_password_token
    password = @refs.password.getDOMNode().value
    confirmation = @refs.confirmation.getDOMNode().value

    auth.resetPassword {password, confirmation, token}
      .then =>
        @setState resetSuccess: true
        alert (resolve) ->
          <LoginDialog onSuccess={=>
            location.hash = '/' # Sorta hacky.
            resolve()
          } />
        return
      .catch (error) =>
        @setState resetError: error
      .then =>
        @setState inProgress: false

  handleEmailSubmit: (e) ->
    e.preventDefault()

    @setState
      inProgress: true
      emailSuccess: false
      emailError: null

    email = @refs.email.getDOMNode().value

    auth.requestPasswordReset {email}
      .then =>
        @setState emailSuccess: true
      .catch (error) =>
        @setState emailError: error
      .then =>
        @setState inProgress: false
