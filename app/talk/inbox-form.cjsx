React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
talkClient = require 'panoptes-client/lib/talk-client'
UserSearch = require '../components/user-search'
{getErrors} = require './lib/validations'
subjectValidations = require './lib/message-subject-validations'
messageValidations = require './lib/message-validations'
CommentBox = require './comment-box'

module.exports = createReactClass
  displayName: 'InboxForm'

  propTypes:
    user: PropTypes.object

  contextTypes:
    geordi: PropTypes.object
    router: PropTypes.object.isRequired

  getInitialState: ->
    validationErrors: []

  validations: (message) ->
    recipient_ids = @userSearch.value()?.value?.length

    userErrors = if (not recipient_ids) then ['Messages must have a recipient'] else []
    subjectErrors = getErrors(@refs.subject.value, subjectValidations)
    messageValidationErrors = getErrors(message, messageValidations)

    validationErrors = userErrors.concat subjectErrors.concat messageValidationErrors
    @setState {validationErrors}
    !!validationErrors.length

  logEvent: (evtType) ->
    @context.geordi?.logEvent
      type: evtType

  onSubmitMessage: (_, body) ->
    @logEvent 'send-message'
    recipient_ids = [parseInt @userSearch.value().value]

    title = @refs.subject.value
    user_id = @props.user.id

    conversation = {title, body, user_id, recipient_ids}

    talkClient.type('conversations').create(conversation).save()
      .then (conversation) =>
        @context.router.push "/inbox/#{conversation.id}"

  render: ->
    <div className="inbox-form talk-module">
      <div className="talk-form talk-moderation-children">
        <h2>To:</h2>
        <UserSearch ref={(component) => @userSearch = component} multi={false} onSearch={@logEvent.bind(this, 'username-search')} />

        <h2>Message:</h2>
        <input placeholder="Subject" type="text" ref="subject"/>
        <CommentBox
          user={@props.user}
          header={null}
          content=""
          validationCheck={@validations}
          validationErrors={@state.validationErrors}
          submitFeedback={"Sent!"}
          onSubmitComment={@onSubmitMessage}
          submit={"Send Message"} />
      </div>
    </div>
