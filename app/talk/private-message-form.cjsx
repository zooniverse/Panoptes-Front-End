React = require 'react'
apiClient = require '../api/client'
talkClient = require '../api/talk'
Router = require 'react-router'

module?.exports = React.createClass
  displayName: 'PrivateMessageForm'
  mixins: [Router.Navigation]

  onSubmit: (e) ->
    e.preventDefault()
    form = @getDOMNode().querySelector('.private-message-form')
    textarea = form.querySelector('textarea')
    input = form.querySelector('input')

    title = input.value
    body = textarea.value

    user_id = @props.user.id

    apiClient.type('users').get(login: @props.params.name).index(0)
      .then (user) =>
        recipient_ids = [+@props.user.id] # must be array
        conversation = {title, body, user_id, recipient_ids}

      .then (conversation) =>
        talkClient.type('conversations').create(conversation).save()
          .then (conversation) =>
            @transitionTo('inbox-conversation', {conversation: conversation.id})

  render: ->
    <div className="talk talk-module">
      {if @props.user
        <form className="private-message-form" onSubmit={@onSubmit}>
          <input placeholder="Subject" />
          <textarea placeholder="Type your message here"></textarea>
          <button>Send</button>
        </form>}
    </div>
