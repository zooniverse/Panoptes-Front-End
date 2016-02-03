React = require 'react'
Loading = require '../components/loading-indicator'
Paginator = require '../talk/lib/paginator'
ChangeListener = require '../components/change-listener'
talkClient = require 'panoptes-client/lib/talk-client'
Notification = require './notifications/notification'

module?.exports = React.createClass
  displayName: 'NotificationsPage'

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

      @setState {notifications, notificationsMap, firstMeta, lastMeta}

  notificationsQuery: (page = @props.location.query.page, options = { }) ->
    page or= 1
    query = Object.assign { }, options, {page}
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

  title: ->
    if @props.project
      "#{ @props.project.display_name } Notifications"
    else if @props.params.section
      "#{ @props.params.section } Notifications"
    else
      'Notifications'

  render: ->
    <div className="talk notifications">
      <div className="content-container">
        <h1 className={"title #{ if @props.project then 'talk-module' else '' }"}>
          {@title()}
        </h1>

        {if @props.user?
          <ChangeListener target={@props.user}>{ =>
            if @state.notifications?.length > 0
              <div>
                  <p>
                    You have{' '}
                    {if @state.unreadCount is 0 then 'no' else @state.unreadCount}{' '}
                    unread notifications
                  </p>
                  {if @state.firstMeta.page > 1 or @state.unreadCount > 0
                    <div className="centering">
                      <div className="talk-module inline-block">
                        {if @state.firstMeta.page > 1
                          <Paginator
                            className="newer inline-block"
                            page={+@state.firstMeta.page}
                            pageCount={@state.firstMeta.page_count}
                            scrollOnChange={false}
                            firstAndLast={false}
                            pageSelector={false}
                            previousLabel={<span>Load newer <i className="fa fa-long-arrow-up" /></span>}
                            onClickPrev={@markAsRead 'first'} />}

                        {if @state.unreadCount > 0
                          <button onClick={@markAllAsRead}>
                            Mark all as read
                          </button>}
                      </div>
                    </div>}

                <div className="list">
                  {for notification in @state.notifications
                    <Notification notification={notification} key={notification.id} user={@props.user} />
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
                <p>You have no notifications</p>
              </div>
            else
              <Loading />
          }</ChangeListener>
        else
          <div className="centering talk-module">
            <p>You're not signed in.</p>
          </div>}
      </div>
    </div>
