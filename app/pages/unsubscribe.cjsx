React = require 'react'
auth = require 'panoptes-client/lib/auth'

module.exports = React.createClass
  displayName: 'UnsubscribeFromEmailsPage'

  getDefaultProps: ->
    location: query: {}

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
    @setState { emailIsValid: @refs.email.checkValidity() }

  handleEmailSubmit: (e) ->
    e.preventDefault()

    @setState
      inProgress: true
      emailSuccess: false
      emailError: false

    email = @refs.email.value

    auth.unsubscribeEmail {email}
      .then =>
        @setState emailSuccess: true
      .catch =>
        @setState emailError: true
      .then =>
        @setState inProgress: false

  render: ->
    <div className="centered-grid">
      {if @props.location.query?.processed
        <div>
          <p><strong>Your unsubscribe request was successfully processed.</strong></p>
          <p>If you change your mind, just visit your <a href="#{window.location.origin}/settings">account settings</a> page to update your email preferences.</p>
        </div>
      else
        <form onSubmit={@handleEmailSubmit}>
          <p><strong>Unsubscribe from all Zooniverse emails.</strong></p>
          <p>We get it - no one likes to keep receiving email they don't want.</p>
          <p>Just enter your email address here and we'll <b>unsubscribe you from all</b> our email lists.</p>
          <p>
            <input ref="email" type="email" required onChange={@handleEmailChange} className="standard-input" defaultValue={@props.location.query?.email} size="50" />
          </p>
          <p>
            <button type="submit" className="standard-button" disabled={!@state.emailIsValid || @state.emailSuccess}>Submit</button>

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
        </form>}
    </div>
