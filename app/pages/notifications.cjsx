React = require 'react'
Loading = require '../components/loading-indicator'
Paginator = require '../talk/lib/paginator'
talkClient = require 'panoptes-client/lib/talk-client'
Notification = require './notifications/notification'
`import NotificationSection from './notifications/notification-section';`

module.exports = React.createClass
  displayName: 'NotificationsPage'

  contextTypes:
    notificationsCounter: React.PropTypes.object

  propTypes:
    project: React.PropTypes.object
    user: React.PropTypes.object

  getDefaultProps: ->
    location: query: page: 1

  getInitialState: ->
    firstMeta: { }
    lastMeta: { }
    notificationsMap: { }

  componentWillMount: ->
    @getNotifications() if @props.user

  componentWillUnmount: ->
    if @props.user
      @markAsRead('first')()
      @markAsRead('last')()

  componentWillReceiveProps: (nextProps) ->
    pageChanged = nextProps.location.query.page isnt @props.location.query.page
    userChanged = nextProps.user and nextProps.user isnt @props.user
    @getNotifications(nextProps.location.query.page) if pageChanged or userChanged

  getNotifications: (page) ->
    @getUnreadCount()
    talkClient.type('notifications').get(@notificationsQuery(page)).then (newNotifications) =>
      meta = newNotifications[0]?.getMeta() or { }
      notifications = @state.notifications or newNotifications
      meta.notificationIds = (n.id for n in newNotifications)
      notificationsMap = @state.notificationsMap

      for notification in newNotifications
        notificationsMap[notification.id] = notification

      {firstMeta, lastMeta} = @state

      if meta.page > @state.lastMeta.page
        lastMeta = meta
        notifications.push newNotifications...
      else if meta.page < @state.firstMeta.page
        firstMeta = meta
        notifications.unshift newNotifications...
      else
        firstMeta = lastMeta = meta

      notificationGroups = @groupNotifications(notifications)
      projNotifications = @sortProjects(notificationGroups)

      @setState {notifications, projNotifications, notificationsMap, firstMeta, lastMeta}

  groupNotifications: (notifications) ->
    notifications.reduce ((groups, notification) ->
      groups[notification.project_id] = groups[notification.project_id] or []
      groups[notification.project_id].push notification
      groups
    ), {}

  sortProjects: (projectGroups) ->
    mostRecent = Object.keys(projectGroups).map (group) ->
      Object.assign {_key: Math.random(), notifications: projectGroups[group], project_id: group}
    mostRecent.sort( (a, b) -> a.notifications[0].updated_at < b.notifications[0].updated_at )
    mostRecent.map (group, i) =>
      if group['project_id'] is ''
        mostRecent.splice i, 1
        mostRecent.unshift group
    mostRecent

  notificationsQuery: (page = @props.location.query.page, options = { }) ->
    page or= 1
    query = Object.assign { }, options, {page}
    query.page_size = 100
    query.section = "project-#{ @props.project.id }" if @props.project
    query.section = @props.params.section if @props.params.section
    query

  getUnreadCount: ->
    talkClient.type('notifications').get(@notificationsQuery(1, page_size: 1, delivered: false)).then (notifications) =>
      unreadCount = notifications[0]?.getMeta()?.count or 0
      @setState {unreadCount}

  markAsRead: (meta) ->
    =>
      ids = @state["#{ meta }Meta"].notificationIds
      ids = (id for id in ids when not @state.notificationsMap[id].delivered)
      return if ids.length is 0
      talkClient.put '/notifications/read', id: ids.join(',')
      for notification in @state.notifications when notification.id in ids
        notification.update delivered: true

  markAllAsRead: ->
    talkClient.put '/notifications/read'
    for notification in @state.notifications
      notification.update delivered: true
    @setState unreadCount: 0
    @context.notificationsCounter.setUnread 0

  title: ->
    if @props.project
      "#{ @props.project.display_name } Notifications"
    else if @props.params.section
      "#{ @props.params.section } Notifications"
    else
      'My Notifications'

  render: ->
    <div className="talk notifications">
      <div className="content-container">
        <h3 className={"title #{ if @props.project then 'talk-module' else 'notifications-title' }"}>
          {@title()}
        </h3>

        {if @props.user?
          if @state.notifications?.length > 0
            <div>

              <div className="list">
                {for group in @state.projNotifications
                  <NotificationSection
                    key={group._key}
                    notifications={group.notifications}
                    projectID={group.project_id}
                    user={this.props.user} />
                }
              </div>

              <div className="centering">
                <Paginator
                  className="older"
                  page={+@state.lastMeta.page}
                  pageCount={@state.lastMeta.page_count}
                  scrollOnChange={false}
                  firstAndLast={false}
                  pageSelector={false}
                  nextLabel={<span>Load more <i className="fa fa-long-arrow-down" /></span>}
                  onClickNext={@markAsRead 'last'} />
              </div>
            </div>
          else if @state.notifications?.length is 0
            <div className="centering talk-module">
              <p>You have no notifications.</p>
              <p>You can receive notifications by participating in Talk, following discussions, and receiving messages.</p>
            </div>
          else
            <Loading />
        else
          <div className="centering talk-module">
            <p>You're not signed in.</p>
          </div>}
      </div>
    </div>
