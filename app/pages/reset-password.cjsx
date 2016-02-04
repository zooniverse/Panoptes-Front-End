React = require 'react'
auth = require 'panoptes-client/lib/auth'
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
    emailError: false
    emailIsValid: false

  componentDidMount: ->
    @handleEmailChange()

  handleResetSubmit: (e) ->
    e.preventDefault()

    @setState
      inProgress: true
      resetSuccess: false
      resetError: null

    token = @props.location.query.reset_password_token
    password = @refs.password.value
    confirmation = @refs.confirmation.value

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

  handleEmailChange: ->
    @setState { emailIsValid: @refs.email?.checkValidity() }

  handleEmailSubmit: (e) ->
    e.preventDefault()

    @setState
      inProgress: true
      emailSuccess: false
      emailError: false

    email = @refs.email.value

    auth.requestPasswordReset {email}
      .then =>
        @setState emailSuccess: true
      .catch =>
        @setState emailError: true
      .then =>
        @setState inProgress: false

  render: ->
    <div className="centered-grid">
      {if @props.location.query?.reset_password_token?
        if @state.resetSuccess
          <p>You have successfully reset your password, please login to get started.</p>
        else
          <form method="POST" onSubmit={@handleResetSubmit}>
            <p>Go ahead and enter a new password, then you can get back to doing some research.</p>

            <p>
              New password:<br />
              <input ref="password" type="password" className="standard-input" size="20" />
            </p>

            <p>
              Again, to confirm:<br />
              <input ref="confirmation" type="password" className="standard-input" size="20" />
            </p>

            <p>
              <button type="submit" className="standard-button" disabled={@state.resetError || @state.resetSuccess}>Submit</button>{' '}
              {if @state.inProgress
                <i className="fa fa-spinner fa-spin form-help"></i>
              else if @state.resetSuccess
                <i className="fa fa-check-circle form-help success"></i>
              else if @state.resetError?
                <small className="form-help error">Something went wrong, please try and reset your password via email again. {@state.resetError.toString()}</small>}
            </p>
          </form>

      else
        <form onSubmit={@handleEmailSubmit}>
          <p><strong>So, you’ve forgotten your password.</strong></p>
          <p>It happens to the best of us. Just enter your email address here and we’ll send you a link you can follow to reset it.</p>
          <p>
            <input ref="email" type="email" required onChange={@handleEmailChange} className="standard-input" defaultValue={@props.location.query?.email} size="50" />
          </p>
          <p>
            <button type="submit" className="standard-button" disabled={!@state.emailIsValid}>Submit</button>

            {' '}

            {if @state.inProgress
              <i className="fa fa-spinner fa-spin form-help"></i>
            else if @state.emailSuccess
              <i className="fa fa-check-circle form-help success"></i>}
          </p>

          {if @state.emailSuccess
            <p>We’ve just sent you an email with a link to reset your password.</p>
          else if @state.emailError
            <small className="form-help error">There was an error reseting your password.</small>}
        </form>}
    </div>
