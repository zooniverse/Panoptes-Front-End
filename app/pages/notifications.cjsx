React = require 'react'
Loading = require '../components/loading-indicator'
Paginator = require '../talk/lib/paginator'
ChangeListener = require '../components/change-listener'
talkClient = require '../api/talk'
Notification = require './notifications/notification'

module?.exports = React.createClass
  displayName: 'NotificationsPage'

  propTypes:
    project: React.PropTypes.object
    user: React.PropTypes.object

  getDefaultProps: ->
    query: page: 1

  getInitialState: ->
    meta: { }
    loading: true

  componentWillMount: ->
    @getNotifications() if @props.user

  componentWillReceiveProps: (nextProps) ->
    pageChanged = nextProps.query.page isnt @props.query.page
    userChanged = nextProps.user and nextProps.user isnt @props.user
    @getNotifications(nextProps.query.page) if pageChanged or userChanged

  getNotifications: (page = @props.query.page) ->
    page or= 1
    query = {page}
    query.section = "project-#{ @props.project.id }" if @props.project
    query.section = @props.params.section if @props.params.section
    talkClient.type('notifications').get(query).then (notifications) =>
      meta = notifications[0]?.getMeta() or { }
      loading = false
      @setState {loading, notifications, meta}

  render: ->
    <div className="talk notifications">
      <div className="content-container">
        {if @props.user?
          <ChangeListener target={@props.user}>{ =>
            if @state.loading
              <Loading />
            else
              <div>
                <Paginator page={+@state.meta.page} pageCount={@state.meta.page_count} />
                <div className="list">
                  {for notification in @state.notifications
                    <Notification notification={notification} key={notification.id} user={@props.user} />
                  }
                </div>
              </div>
          }</ChangeListener>
        else
          <p>You're not signed in.</p>}
      </div>
    </div>
