React = require 'react'
talkClient = require '../api/talk'
authClient = require '../api/auth'
apiClient = require '../api/client'
ChangeListener = require '../components/change-listener'
PromiseRenderer = require '../components/promise-renderer'
PromiseToSetState = require '../lib/promise-to-set-state'
Paginator = require './lib/paginator'
Router = {Link} = require 'react-router'
Loading = require '../components/loading-indicator'
InboxForm = require './inbox-form'
talkConfig = require './config'
{timeAgo} = require './lib/time'

PAGE_SIZE = talkConfig.inboxPageSize

module?.exports = React.createClass
  displayName: 'TalkInbox'
  mixins: [Router.Navigation, PromiseToSetState]

  getInitialState: ->
    user: null
    conversations: []
    conversationsMeta: {}
    loading: true

  componentDidMount: ->
    @handleAuthChange()
    authClient.listen @handleAuthChange

  componentWillUnmount: ->
    authClient.stopListening @handleAuthChange

  handleAuthChange: ->
    authClient.checkCurrent()
      .then (user) =>
        if user?
          @setState {user}, @setConversations
        else
          @setState {user: null} # don't want the callback without a user...

  setConversations: (page) ->
    talkClient.type('conversations').get({user_id: @state.user.id, page_size: PAGE_SIZE, page, sort: '-updated_at', include: 'users'})
      .then (conversations) =>
        conversationsMeta = conversations[0]?.getMeta()
        @setState {conversations, conversationsMeta, loading: false}

  onPageChange: (page) ->
    @goToPage(page)

  goToPage: (n) ->
    @transitionTo(@props.path, @props.params, {page: n})
    @setConversations(n)

  message: (data, i) ->
    <p key={data.id} class>{data.body}</p>

  conversationLink: (conversation, i) ->
    unread = conversation.is_unread
    <div className="conversation-link #{if unread then 'unread' else ''}" key={conversation.id}>
      <PromiseRenderer promise={apiClient.type('users').get(conversation.links.users.filter (userId) => userId isnt @state.user.id)}>{(users) =>
        <div>
          {users.map (user, i) =>
            <div>
              <strong><Link key={user.id} to="user-profile" params={name: user.login}>{user.display_name}</Link></strong>
              <div>{timeAgo(conversation.updated_at)}</div>{', ' if i isnt (users.length-1)}
            </div>}
        </div>
      }</PromiseRenderer>

      <Link to="inbox-conversation" params={conversation: conversation.id}>
        {if unread
          <i className="fa fa-comments-o"/>}
        {conversation.title}
      </Link>
    </div>

  render: ->
    {conversations, user, loading} = @state
    <div className="talk inbox content-container">
      <h1>Inbox</h1>

      {if loading
        <Loading />
      else if not user
        <p>Please sign in to view your inbox</p>
      else if conversations?.length is 0
        <p>You have not started any private conversations yet. Send users private messages by visiting their profile page.</p>
      else if conversations?.length
        <div>
          {conversations?.map(@conversationLink)}
          <Paginator page={+@state.conversationsMeta.page} onPageChange={@onPageChange} pageCount={@state.conversationsMeta?.page_count} />
        </div>}

      {if user?
        <div>
          <h1>Send a message</h1>
          <InboxForm user={user} />
        </div>}

    </div>
