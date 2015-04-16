React = require 'react'
talkClient = require '../api/talk'
authClient = require '../api/auth'
apiClient = require '../api/client'
ChangeListener = require '../components/change-listener'
PromiseRenderer = require '../components/promise-renderer'
PromiseToSetState = require '../lib/promise-to-set-state'
Paginator = require './lib/paginator'
Router = {Link} = require 'react-router'

PAGE_SIZE = 10

module?.exports = React.createClass
  displayName: 'TalkInbox'
  mixins: [Router.Navigation, PromiseToSetState]

  getInitialState: ->
    user: null
    conversations: []
    conversationsMeta: {}

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
      .catch (e) -> console.log "error checking current auth inbox", e

  setConversations: (page) ->
    talkClient.type('conversations').get({user_id: @state.user.id, page_size: PAGE_SIZE, page,sort: '-updated_at'})
      .then (conversations) =>
        conversationsMeta = conversations[0]?.getMeta()
        @setState {conversations, conversationsMeta}
      .catch (e) -> console.log "e conversations", e

  onPageChange: (page) ->
    @goToPage(page)

  goToPage: (n) ->
    @transitionTo(@props.path, @props.params, {page: n})
    @setConversations(n)

  message: (data, i) ->
    <p key={i} class>{data.body}</p>

  conversationLink: (data, i) ->
    <div className="conversation-link">
      <Link to="inbox-conversation" params={conversation: data.id}>
        {data.title}
      </Link>
    </div>

  render: ->
    <div className="inbox content-container">
      <h1>Inbox</h1>
      {if not @state.user
         <p>Please sign in to view your inbox</p>}

      {@state.conversations?.map(@conversationLink)}
      <Paginator page={+@state.conversationsMeta.page} onPageChange={@onPageChange} pageCount={@state.conversationsMeta.page_count} />
    </div>
