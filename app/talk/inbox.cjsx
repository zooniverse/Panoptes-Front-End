React = require 'react'
talkClient = require 'panoptes-client/lib/talk-client'
apiClient = require 'panoptes-client/lib/api-client'
Paginator = require './lib/paginator'
{Link} = require 'react-router'
Loading = require '../components/loading-indicator'
InboxForm = require './inbox-form'
talkConfig = require './config'
{timeAgo} = require './lib/time'
SignInPrompt = require '../partials/sign-in-prompt'
alert = require '../lib/alert'

PAGE_SIZE = talkConfig.inboxPageSize

promptToSignIn = -> alert (resolve) -> <SignInPrompt onChoose={resolve} />

ConversationLink = React.createClass
  displayName: 'ConversationLink'
  
  propTypes:
    user: React.PropTypes.object
    conversation: React.PropTypes.object

  getInitialState: ->
    users: []
    messages: []
  
  componentWillMount: ->
    apiClient
      .type 'users'
      .get @props.conversation.links.users.filter (userId) => userId isnt @props.user.id
      .then (users) =>
        @setState {users}

    @props.conversation
      .get 'messages', {page_size: 1, sort: '-created_at'}
      .then (messages) =>
        @setState {messages}

  render: ->
    unread = @props.conversation.is_unread
    <div className="conversation-link #{if unread then 'unread' else ''}">
      <div>
        {@state.users.map (user, i) =>
          <div key={user.id}>
            <strong><Link key={user.id} to="/users/#{user.login}">{user.display_name}</Link></strong>
            <div>{timeAgo(@state.messages[0]?.updated_at)}{', ' if i isnt (@state.users.length-1)}</div>
          </div>}
      </div>

      <Link to="/inbox/#{@props.conversation.id}">
        {if unread
          <i className="fa fa-comments-o"/>}
        {@props.conversation.title}
      </Link>
    </div>

module.exports = React.createClass
  displayName: 'TalkInbox'

  contextTypes:
    router: React.PropTypes.object.isRequired

  getDefaultProps: ->
    location: query: page: 1

  getInitialState: ->
    conversations: []
  
  componentWillMount: ->
    @setConversations @props.user

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.user is @props.user
      @setConversations(nextProps.user)
    unless nextProps.location.query.page is @props.location.query.page
      @setConversations(nextProps.user, nextProps.location.query.page)

  setConversations: (user, page) ->
    return unless user?
    conversationsQuery =
      user_id: user.id
      page_size: PAGE_SIZE
      page: @props.location.query.page
      sort: '-updated_at'
      include: 'users'

    talkClient
      .type 'conversations'
      .get conversationsQuery
      .then (conversations) =>
        @setState {conversations}

  onPageChange: (page) ->
    @goToPage(page)

  goToPage: (n) ->
    @context.router.push "/inbox?page=#{n}"
    @setConversations(@props.user, n)

  message: (data, i) ->
    <p key={data.id} class>{data.body}</p>

  render: ->
    <div className="talk inbox content-container">
      {unless @props.user?
        <p>Please <button className="link-style" type="button" onClick={promptToSignIn}>sign in</button> to view your inbox</p>
      else
        <div>
          <h1>Inbox</h1>

          {if @state.conversations.length is 0
            <p>You have not started any private conversations yet. Send users private messages by visiting their profile page.</p>
          else
            conversationsMeta = @state.conversations[0].getMeta()
            <div>
              {@state.conversations.map (conversation) => 
                <ConversationLink conversation={conversation} user={@props.user} key={conversation.id} />
              }
              <Paginator
                page={+conversationsMeta.page}
                pageCount={+conversationsMeta.page_count} />
            </div>}

          <div>
            <h1>Send a message</h1>
            <InboxForm user={@props.user} />
          </div>
        </div>
        }
    </div>
