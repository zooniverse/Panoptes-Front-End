React = require 'react'
apiClient = require '../api/client'
authClient = require '../api/auth'
talkClient = require '../api/talk'
Router = require 'react-router'

module?.exports = React.createClass
  displayName: 'PrivateMessageForm'

  mixins: [Router.Navigation]

  getInitialState: ->
    user: null

  componentWillMount: ->
    @handleAuthChange()
    authClient.listen @handleAuthChange

  componentWillUnmount: ->
    authClient.stopListening @handleAuthChange

  handleAuthChange: ->
    authClient.checkCurrent()
      .then (user) =>
        @setState {user}
      .catch (e) -> console.log "error checking current auth inbox", e

  onSubmit: ->
    form = @getDOMNode().querySelector('.private-message-form')
    textarea = form.querySelector('textarea')
    input = form.querySelector('input')

    title = input.value
    body = textarea.value

    user_id = @state.user.id

    apiClient.type('users').get(display_name: @props.params.name).index(0)
      .then (user) =>
        console.log "user", user
        recipient_ids = [+user.id] # must be array
        conversation = {title, body, user_id, recipient_ids}

      .then (conversation) =>
        console.log "conversation", conversation
        talkClient.type('conversations').create(conversation).save()
          .then (conversation) =>
            console.log "conversation save successful", conversation
            @transitionTo('inbox-conversation', {conversation: conversation.id})

          .catch (e) ->
            console.log "e conversation", e

  render: ->
    <div className="talk talk-module">
      {if @state.user
        <form className="private-message-form" onSubmit={@onSubmit}>
          <input placeholder="Subject" />
          <textarea placeholder="Type your message here"></textarea>
          <button>Send</button>
        </form>}
    </div>
