React = require 'react'
talkClient = require 'panoptes-client/lib/talk-client'
apiClient = require 'panoptes-client/lib/api-client'
PromiseRenderer = require '../components/promise-renderer'
SingleSubmitButton = require '../components/single-submit-button'
HandlePropChanges = require '../lib/handle-prop-changes'
{Markdown} = require 'markdownz'
CommentBox = require './comment-box'
{Link, History} = require 'react-router'
{timestamp} = require './lib/time'

module?.exports = React.createClass
  displayName: 'InboxConversation'
  mixins: [HandlePropChanges, History]

  getInitialState: ->
    messages: []
    messagesMeta: {}
    conversation: {}
    recipients: []

  propChangeHandlers:
    user: 'setConversation'

  setConversation: ->
    conversation_id = @props.params?.conversation?.toString()
    # skip cache so messages marked as unread
    talkClient.type('conversations').get(conversation_id, {include: 'users'})
      .then (conversation) =>
        apiClient.type('users').get(conversation.links.users)
          .then (recipients) =>
            @setState {conversation, recipients}, @setMessagesMeta

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
      <PromiseRenderer promise={apiClient.type('users').get(data.user_id)}>{(commentOwner) =>
        <span>
          <strong><Link to="/users/#{commentOwner.login}">{commentOwner.display_name}</Link></strong>{' '}
          <span>{timestamp(data.updated_at)}</span>
        </span>
      }</PromiseRenderer>

      <Markdown>{data.body}</Markdown>
    </div>

  onSubmitMessage: (_, textContent) ->
    body = textContent
    user_id = +@props.user.id
    conversation_id = +@state.conversation.id

    message = {user_id, body, conversation_id}

    talkClient.type('messages').create(message).save()
      .then (message) =>
        @setConversation()

  handleDelete: (e) ->
    e.preventDefault()
    if confirm 'Are you sure you want to archive this conversation?'
      @state.conversation.delete().then =>
        @history.pushState(null, '/inbox')

  render: ->
    if @props.user
      <div className="talk inbox-conversation content-container">
        <Link to="/inbox">Back to Inbox</Link>
        <h1>{@state.conversation?.title}</h1>
        {if @state.recipients.length
          <div>
            In this conversation:{' '}
            {@state.recipients.map (user, i) =>
              <span key={user.id}>
                <Link to="/users/#{user.login}">
                  {user.display_name}
                </Link>{', ' unless i is @state.recipients.length-1}
              </span>
              }
          </div>
          }
        <SingleSubmitButton className="delete-conversation" onClick={@handleDelete}>Archive this conversation</SingleSubmitButton>
        <div>{@state.messages.map(@message)}</div>
        <CommentBox
          header={"Send a message..."}
          content=""
          submitFeedback={'Sent!'}
          submit={"Send"}
          onSubmitComment={@onSubmitMessage}
          validationCheck={ -> false }
          validationErrors={[]}
          user={@props.user} />
      </div>
    else
      <div className="content-container">You are not permitted to view this conversation.</div>
