React = { findDOMNode } = require 'react'
auth = require '../api/auth'
alert = require '../lib/alert'
LoginDialog = require '../partials/login-dialog'

module.exports = React.createClass
  displayName: 'UnsubscribeFromEmailsPage'

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

  handleEmailChange: ->
    @setState { emailIsValid: findDOMNode(@refs.email).checkValidity() }

  handleEmailSubmit: (e) ->
    e.preventDefault()

    @setState
      inProgress: true
      emailSuccess: false
      emailError: false

    email = findDOMNode(@refs.email).value

    auth.unsubscribeEmail {email}
      .then =>
        @setState emailSuccess: true
      .catch =>
        @setState emailError: true
      .then =>
        @setState inProgress: false

  render: ->
    <div className="centered-grid">
      <form onSubmit={@handleEmailSubmit}>
        <p><strong>Unsubscribe from all Zooniverse emails.</strong></p>
        <p>We get it, no one like keep getting email they don't want.</p>
        <p>Just enter your email address here and we'll <b>unsubscribe you from all</b> our email lists.</p>
        <p>
          <input ref="email" type="email" required onChange={@handleEmailChange} className="standard-input" defaultValue={@props.query?.email} size="50" />
        </p>
        <p>
          {if @state.emailIsValid
            <button type="submit" className="standard-button">Submit</button>
          else
            <button type="submit" className="standard-button" disabled>Submit</button>}

          {' '}

          {if @state.inProgress
            <i className="fa fa-spinner fa-spin form-help"></i>
          else if @state.emailSuccess
            <i className="fa fa-check-circle form-help success"></i>}
        </p>

        {if @state.emailSuccess
          <p>You've been unsubscribed!</p>
        else if @state.emailError
          <small className="form-help error">There was an error unsubscribing your email.</small>}
      </form>
    </div>
