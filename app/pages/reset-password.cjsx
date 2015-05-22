React = require 'react'
auth = require '../api/auth'
apiClient = require '../api/client'

RequestForm = React.createClass

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

          <p><button type="submit" className="standard-button">Submit</button></p>
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
        </form>}
    </div>

  handleResetSubmit: (e) ->
    e.preventDefault()

    @setState
      inProgress: true
      resetSuccess: false
      resetError: null

    payload =
      users:
        reset_password_token: @props.query.reset_password_token
        password: @refs.password.getDOMNode().value
        password_confirmation: @refs.confirmation.getDOMNode().value

    apiClient.put '../users/password', payload
      .then =>
        @setState resetSuccess: true
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

    auth.requestPasswordReset email: @refs.email.getDOMNode().value
      .then =>
        @setState emailSuccess: true
      .catch (error) =>
        @setState emailError: error
      .then =>
        @setState inProgress: false
