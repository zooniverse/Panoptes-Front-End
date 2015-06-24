React = require 'react'
talkClient = require '../api/talk'
authClient = require '../api/auth'
apiClient = require '../api/client'
PromiseRenderer = require '../components/promise-renderer'
{Link} = require 'react-router'

module?.exports = React.createClass
  displayName: 'InboxConversation'

  getInitialState: ->
    messages: []
    messagesMeta: {}
    conversation: {}
    user: null

  componentWillMount: ->
    @handleAuthChange()
    authClient.listen @handleAuthChange

  componentWillUnmount: ->
    authClient.stopListening @handleAuthChange

  handleAuthChange: ->
    authClient.checkCurrent()
      .then (user) =>
        if user?
          @setState {user}, @setConversation
        else
          @setState {user: null} # don't want the callback without a user...

  setConversation: ->
    conversation_id = @props.params?.conversation?.toString()
    # skip cache so messages marked as unread
    talkClient.type('conversations').get(conversation_id, {})
      .then (conversation) =>
        @setState {conversation}, @setMessagesMeta

  setMessagesMeta: ->
    conversation_id = +@props.params.conversation
    talkClient.type('messages').get({conversation_id})
      .then (messages) =>
        messagesMeta = messages[0]?.getMeta()
        @setState {messagesMeta}, => @setMessages(messagesMeta.count)

  setMessages: (count = 10) ->
    conversation_id = +@props.params.conversation
    talkClient.type('messages').get({conversation_id, page_size: count}) # show all of them
      .then (messages) =>
        messagesMeta = messages[0].getMeta()
        @setState {messages, messagesMeta}

  message: (data, i) ->
    <div className="conversation-message" key={data.id}>
      <PromiseRenderer promise={apiClient.type('users').get(data.user_id.toString())}>{(commentOwner) =>
        <strong><Link to="user-profile" params={name: commentOwner.login}>{commentOwner.display_name}</Link></strong>
      }</PromiseRenderer>

      <p>{data.body}</p>
    </div>

  onSubmitMessage: (e) ->
    e.preventDefault()

    form = @getDOMNode().querySelector('.new-message-form')
    textarea = form.querySelector('textarea')
    body = textarea.value
    user_id = +@state.user.id
    conversation_id = @state.conversation.id

    message = {user_id, body, conversation_id}

    talkClient.type('messages').create(message).save()
      .then (message) =>
        @setConversation()
        textarea.value = ''

  render: ->
    <div className="talk inbox-conversation content-container">
      <h1>{@state.conversation?.title}</h1>
      {@state.messages.map(@message)}
      <form onSubmit={@onSubmitMessage} className="new-message-form">
        <textarea placeholder="Type a message here"></textarea>
        <button type="submit">Send</button>
      </form>
    </div>
