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

PAGE_SIZE = 10

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
    talkClient.type('conversations').get({user_id: @state.user.id, page_size: PAGE_SIZE, page,sort: '-updated_at'})
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
    <div className="conversation-link #{if unread then 'unread' else ''}">
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
        <p>You have not started any private conversations yet</p>
      else if conversations?.length
        <div>
          {conversations?.map(@conversationLink)}
          <Paginator page={+@state.conversationsMeta.page} onPageChange={@onPageChange} pageCount={@state.conversationsMeta?.page_count} />
        </div>}
    </div>
