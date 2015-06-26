React = {findDOMNode} = require 'react'
talkClient = require '../api/talk'
UserSearch = require '../components/user-search'
{Navigation} = require 'react-router'
{getErrors} = require './lib/validations'
subjectValidations = require './lib/message-subject-validations'
messageValidations = require './lib/message-validations'

module?.exports = React.createClass
  displayName: 'InboxForm'
  mixins: [Navigation]

  propTypes:
    user: React.PropTypes.object

  getInitialState: ->
    validationErrors: []

  validations: (message, subject, recipients) ->
    userErrors = if (not recipients.length) then ['Messages must have a recipient'] else []
    subjectErrors = getErrors(subject, subjectValidations)
    messageValidationErrors = getErrors(message, messageValidations)

    validationErrors = userErrors.concat subjectErrors.concat messageValidationErrors
    @setState {validationErrors}
    !!validationErrors.length

  onSubmitMessage: (e) ->
    e.preventDefault()
    form = findDOMNode(@refs.form)

    recipient_ids = form.querySelector('[name="userids"]')
      .value.split(',').map (id) -> parseInt(id)
      .filter(Number)

    title = findDOMNode(@refs.subject).value
    body = findDOMNode(@refs.message).value
    user_id = @props.user.id

    conversation = {title, body, user_id, recipient_ids}

    errors = @validations(body, title, recipient_ids)
    return errors if errors

    talkClient.type('conversations').create(conversation).save()
      .then (conversation) =>
        @transitionTo('inbox-conversation', {conversation: conversation.id})

  render: ->
    validationErrors = @state.validationErrors.map (message, i) =>
      <p key={i} className="talk-validation-error">{message}</p>

    <div className="inbox-form talk-module">
      <form onSubmit={@onSubmitMessage} className="talk-form talk-moderation-children" ref="form">
        <h2>To:</h2>
        <UserSearch multi={false} />

        <h2>Message:</h2>
        <input placeholder="Subject" type="text" ref="subject"/>
        <textarea placeholder="Type your message here" ref="message"/>
        <div>{validationErrors}</div>
        <button type="submit">Send</button>
      </form>
    </div>
