React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
talkClient = require 'panoptes-client/lib/talk-client'
apiClient = require 'panoptes-client/lib/api-client'
{Link} = require 'react-router'
{ Helmet } = require 'react-helmet'
counterpart = require 'counterpart'
Paginator = require './lib/paginator'
Loading = require('../components/loading-indicator').default
InboxForm = require './inbox-form'
talkConfig = require './config'
{timeAgo} = require './lib/time'
SignInPrompt = require '../partials/sign-in-prompt'
alert = require('../lib/alert').default

PAGE_SIZE = talkConfig.inboxPageSize

promptToSignIn = -> alert (resolve) -> <SignInPrompt onChoose={resolve} />

counterpart.registerTranslations 'en',
  messagesPage:
    title: 'Inbox'

ConversationLink = createReactClass
  displayName: 'ConversationLink'

  propTypes:
    user: PropTypes.object
    conversation: PropTypes.object

  getInitialState: ->
    users: []
    messages: []

  componentWillMount: ->
    apiClient
      .type 'users'
      .get @props.conversation.participant_ids.filter (userId) => userId isnt parseInt(@props.user.id)
      .then (users) =>
        @setState {users}

    @props.conversation
      .get 'messages', {page_size: 1, sort: '-created_at'}
      .then (messages) =>
        @setState {messages}

  render: ->
    unread = @props.conversation.is_unread
    if @state.users.length > 0
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
    else
      <div></div>

module.exports = createReactClass
  displayName: 'TalkInbox'

  contextTypes:
    router: PropTypes.object.isRequired

  getDefaultProps: ->
    location: query: page: 1

  getInitialState: ->
    conversations: []

  componentWillMount: ->
    @setConversations @props.user, @props.location.query.page

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.user is @props.user
      @setConversations(nextProps.user, @props.location.query.page)
    unless nextProps.location.query.page is @props.location.query.page
      @setConversations(nextProps.user, nextProps.location.query.page)

  setConversations: (user, page) ->
    return unless user?
    conversationsQuery =
      user_id: user.id
      page_size: PAGE_SIZE
      page: page
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
      <Helmet title={counterpart 'messagesPage.title'} />
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
                pageCount={+conversationsMeta.page_count}
                onPageChange={@onPageChange}
              />
            </div>}

          <div>
            <h1>Send a message</h1>
            <InboxForm user={@props.user} />
          </div>
        </div>
        }
    </div>
