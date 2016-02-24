React = require 'react'
ReactDOM = require 'react-dom'
talkClient = require 'panoptes-client/lib/talk-client'
UserSearch = require '../components/user-search'
{History} = require 'react-router'
{getErrors} = require './lib/validations'
subjectValidations = require './lib/message-subject-validations'
messageValidations = require './lib/message-validations'
CommentBox = require './comment-box'

module?.exports = React.createClass
  displayName: 'InboxForm'
  mixins: [History]

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

  onSubmitMessage: (_, body) ->
    recipient_ids = ReactDOM.findDOMNode(@).querySelector('[name="userids"]').value
      .split(',').map (id) -> parseInt(id)
      .filter(Number)

    title = @refs.subject.value
    user_id = @props.user.id

    errored = @validations(body, title, recipient_ids)
    return errored if errored

    conversation = {title, body, user_id, recipient_ids}

    talkClient.type('conversations').create(conversation).save()
      .then (conversation) =>
        @history.pushState(null, "/inbox/#{conversation.id}")

  render: ->
    <div className="inbox-form talk-module">
      <div className="talk-form talk-moderation-children">
        <h2>To:</h2>
        <UserSearch multi={false} />

        <h2>Message:</h2>
        <input placeholder="Subject" type="text" ref="subject"/>
        <CommentBox
          user={@props.user}
          header={null}
          content=""
          validationCheck={ -> false }
          validationErrors={@state.validationErrors}
          submitFeedback={"Sent!"}
          onSubmitComment={@onSubmitMessage}
          submit={"Send Message"} />
      </div>
    </div>
