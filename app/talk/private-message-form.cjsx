React = require 'react'
apiClient = require '../api/client'
talkClient = require '../api/talk'
Router = require 'react-router'
CommentBox = require './comment-box'

module?.exports = React.createClass
  displayName: 'PrivateMessageForm'
  mixins: [Router.Navigation]

  onSubmitMessage: (_, body) ->
    pm = @getDOMNode().querySelector('.private-message-form')
    input = pm.querySelector('input')

    title = input.value
    user_id = @props.user.id

    apiClient.type('users').get(login: @props.params.name).index(0)
      .then (user) =>
        recipient_ids = [+user.id] # must be array
        conversation = {title, body, user_id, recipient_ids}

      .then (conversation) =>
        talkClient.type('conversations').create(conversation).save()
          .then (conversation) =>
            @transitionTo('inbox-conversation', {conversation: conversation.id})

  render: ->
    <div className="talk talk-module">
      {if @props.user
        <div className="private-message-form">
          <input placeholder="Subject" />
          <CommentBox
            header={null}
            user={@props.user}
            content=""
            validationCheck={ -> false }
            validationErrors={[]}
            submitFeedback={"Sent!"}
            onSubmitComment={@onSubmitMessage}
            submit={"Send Message"} />
        </div>}
    </div>
