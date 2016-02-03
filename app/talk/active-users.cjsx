React = require 'react'
talkClient = require 'panoptes-client/lib/talk-client'
{sugarClient} = require 'panoptes-client/lib/sugar'
apiClient = require 'panoptes-client/lib/api-client'
{sugarApiClient} = require 'panoptes-client/lib/sugar'
{Link} = require 'react-router'
Paginator = require './lib/paginator'

module?.exports = React.createClass
  displayName: 'ActiveUsers'

  getInitialState: ->
    userRecords: { }
    users: []
    total: 0
    pageCount: 0
    perPage: 10
    page: 1

  componentDidMount: ->
    @update()

  componentWillUnmount: ->
    @resetTimer()

  update: ->
    @restartTimer()
    @getActiveUserIds().then (userIds) =>
      pageCount = @pageCount userIds
      page = @boundedPage pageCount
      onPage = @userIdsOnPage userIds, page

      @fetchUncachedUsers(onPage).then(@cacheUsers).then (users) =>
        activeUsers = (@state.userRecords[id] for id in onPage when @state.userRecords[id]?)
        @setState userRecords: @state.userRecords, users: activeUsers, page: page, pageCount: pageCount, total: userIds.length
        @restartTimer()
      .catch =>
        @restartTimer()

  cacheUsers: (users) ->
    @state.userRecords[user.id] = user for user in users

  fetchUncachedUsers: (ids) ->
    cachedIds = Object.keys @state.userRecords
    uncachedIds = (id for id in ids when id not in cachedIds)

    if uncachedIds.length > 0
      apiClient.type('users').get id: uncachedIds
    else
      Promise.resolve []

  userIdsOnPage: (ids, page) ->
    offset = (page - 1) * @state.perPage
    ids.slice offset, offset + @state.perPage

  getActiveUserIds: ->
    sugarApiClient.get '/active_users', channel: @props.section
    .then (activeUserIds) =>
      (user.id for user in activeUserIds).reverse()
    .catch =>
      @restartTimer()

  boundedPage: (pageCount) ->
    if @state.page > pageCount
      pageCount
    else if @state.page < 1
      1
    else
      @state.page

  pageCount: (userIds) ->
    Math.ceil userIds.length / @state.perPage

  onPageChange: (page) ->
    @setState page: page
    @update()

  resetTimer: ->
    clearTimeout(@updateTimeout) if @updateTimeout

  restartTimer: ->
    @resetTimer()
    @updateTimeout = setTimeout @update, 10000

  userLink: (user) ->
    <li key={user.id}>
      <Link to="/users/#{user.login}" title="#{user.display_name}'s profile">{user.display_name}</Link>
    </li>

  render: ->
    <div className="talk-active-users">
      <h3>{@state.total} Active Participants:</h3>
      <ul>
        {@state.users.map(@userLink)}
      </ul>
      {if @state.pageCount > 1
        <Paginator page={+@state.page} onPageChange={@onPageChange} pageCount={@state.pageCount} scrollOnChange={false} firstAndLast={false} pageSelector={false} />
      }
    </div>
