React = require 'react'
Loading = require '../components/loading-indicator'
talkClient = require 'panoptes-client/lib/talk-client'
`import NotificationSection from './notifications/notification-section';`

module.exports = React.createClass
  displayName: 'NotificationsPage'

  propTypes:
    project: React.PropTypes.object
    user: React.PropTypes.object

  getDefaultProps: () ->
    location: { query: { page: 1 } }

  getInitialState: () ->
    projNotifications: []

  componentWillMount: ->
    @getProjectNotifications(@props.user) if @props.user

  componentWillReceiveProps: (nextProps) ->
    @getProjectNotifications(nextProps.user) if nextProps.user

  getProjectNotifications: (user) ->
    if @props.project
      talkClient.type('notifications').get({ page: 1, page_size: 1, section: 'project-' + @props.project.id })
        .then (projNotifications) =>
          @setState {projNotifications: projNotifications }
    else
      talkClient.type('notifications').get({ page: 1, page_size: 50 })
        .then (projNotifications) =>
          sortedNotifications = @sortNotifications(projNotifications)
          @setState {projNotifications: sortedNotifications }

  sortNotifications: (notifications) ->
    projectSections = []
    projectNotifications = []
    notifications.map (notification) ->
      if projectSections.indexOf(notification.section) < 0
        if notification.section is 'zooniverse'
          projectSections.unshift(notification.section)
          projectNotifications.unshift(notification)
        else
          projectSections.push(notification.section)
          projectNotifications.push(notification)
    projectNotifications

  onChildChanged: (id) ->
    this.setState({expanded: id})

  render: ->
    <div className="talk notifications">
      <div className="content-container">
        <h3 className={"centering title #{ if @props.project then 'notifications-title__project' else 'notifications-title' }"}>
          My Notifications
        </h3>

        {if @props.user?
          if @state.projNotifications?.length > 0
            <div>

              <div className="list">
                {for notification in @state.projNotifications
                  <NotificationSection
                    key={notification.id}
                    callbackParent={@onChildChanged}
                    location={@props.location}
                    expanded={true if notification.project_id is @state.expanded}
                    projectID={notification.project_id}
                    slug={notification.project_slug}
                    section={notification.section}
                    user={this.props.user} />
                }
              </div>

            </div>
          else if @state.projNotifications?.length is 0
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
