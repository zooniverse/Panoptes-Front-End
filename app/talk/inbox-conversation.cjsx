React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
talkClient = require 'panoptes-client/lib/talk-client'
apiClient = require 'panoptes-client/lib/api-client'
SingleSubmitButton = require '../components/single-submit-button'
HandlePropChanges = require '../lib/handle-prop-changes'
{Markdown} = require 'markdownz'
CommentBox = require './comment-box'
{Link} = require 'react-router'
{timestamp} = require './lib/time'
{ Helmet } = require 'react-helmet'
counterpart = require 'counterpart'


Message = createReactClass
  displayName: 'Message'
  
  getInitialState: ->
    commentOwner: null
  
  componentDidMount: ->
    @updateOwner @props.data.user_id

  componentWillReceiveProps: (newProps) ->
    @updateOwner newProps.data.user_id if newProps.data isnt @props.data

  updateOwner: (user_id)->
    apiClient.type 'users'
      .get user_id
      .then (commentOwner) =>
        @setState {commentOwner}
  
  render: ->
    <div className="conversation-message">
      <span>
        <strong><Link to="/users/#{@state.commentOwner?.login}">{@state.commentOwner?.display_name}</Link> (@{@state.commentOwner?.login})</strong>{' '}
        <span>{timestamp(@props.data.updated_at)}</span>
      </span>
      <Markdown>{@props.data.body}</Markdown>
    </div>

module.exports = createReactClass
  displayName: 'InboxConversation'
  mixins: [HandlePropChanges]

  contextTypes:
    router: PropTypes.object.isRequired

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
        @context.router.push '/inbox'

  render: ->
    if @props.user
      <div className="talk inbox-conversation content-container">
        <Helmet title="#{@state.conversation?.title} » #{counterpart 'messagesPage.title'}" />
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
        <SingleSubmitButton className="delete-conversation" onClick={@handleDelete}>Delete this conversation</SingleSubmitButton>
        <div>{@state.messages.map (message) -> <Message data={message} key={message.id} />}</div>
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
