React = require 'react'
talkClient = require '../api/talk'
apiClient = require '../api/client'
PromiseRenderer = require '../components/promise-renderer'
Paginator = require './lib/paginator'
Router = {Link} = require 'react-router'
Loading = require '../components/loading-indicator'
InboxForm = require './inbox-form'
talkConfig = require './config'
{timeAgo} = require './lib/time'
SignInPrompt = require '../partials/sign-in-prompt'
alert = require '../lib/alert'

PAGE_SIZE = talkConfig.inboxPageSize

promptToSignIn = -> alert (resolve) -> <SignInPrompt onChoose={resolve} />

module?.exports = React.createClass
  displayName: 'TalkInbox'
  mixins: [Router.Navigation]

  getDefaultProps: ->
    query: page: 1

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.query.page is @props.query.page
      @setConversations(nextProps.query.page)

  setConversations: (page) ->
    conversationsQuery =
      user_id: @props.user.id
      page_size: PAGE_SIZE
      page: @props.query.page
      sort: '-updated_at'
      include: 'users'

    talkClient.type('conversations').get conversationsQuery

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
      <PromiseRenderer promise={apiClient.type('users').get(conversation.links.users.filter (userId) => userId isnt @props.user.id)}>{(users) =>
        <div>
          {users.map (user, i) =>
            <div key={user.id}>
              <strong><Link key={user.id} to="user-profile" params={name: user.login}>{user.display_name}</Link></strong>
                <PromiseRenderer promise={conversation.get('messages', {page_size: 1, sort: '-created_at'})}>{(messages) =>
                  <div>{timeAgo(messages[0].updated_at)}{', ' if i isnt (users.length-1)}</div>
                }</PromiseRenderer>
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
    <div className="talk inbox content-container">
      {unless @props.user?
        <p>Please <button className="link-style" type="button" onClick={promptToSignIn}>sign in</button> to view your inbox</p>
      else
        <PromiseRenderer promise={@setConversations()} pending={-><Loading />}>{(conversations = []) =>
          <div>
            <h1>Inbox</h1>

            {if conversations.length is 0
              <p>You have not started any private conversations yet. Send users private messages by visiting their profile page.</p>
            else
              conversationsMeta = conversations[0].getMeta()
              <div>
                <div>{conversations.map(@conversationLink)}</div>
                <Paginator
                  page={+conversationsMeta.page}
                  pageCount={+conversationsMeta.page_count} />
              </div>}

            <div>
              <h1>Send a message</h1>
              <InboxForm user={@props.user} />
            </div>
          </div>
        }</PromiseRenderer>}
    </div>
