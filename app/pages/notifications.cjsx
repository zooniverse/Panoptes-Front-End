React = require 'react'
Loading = require '../components/loading-indicator'
Paginator = require '../talk/lib/paginator'
talkClient = require 'panoptes-client/lib/talk-client'
Notification = require './notifications/notification'
`import getNotificationProjects from '../talk/lib/get-notification-projects';`
`import NotificationSection from './notifications/notification-section';`

module.exports = React.createClass
  displayName: 'NotificationsPage'

  propTypes:
    project: React.PropTypes.object
    user: React.PropTypes.object

  getDefaultProps: () ->
    location: { query: { page: 1 } }

  getInitialState: () ->
    loading: true
    projNotifications: []

  componentWillMount: ->
    @getProjectNotifications(@props.user) if @props.user

  componentWillReceiveProps: (nextProps) ->
    @getProjectNotifications(nextProps.user) if nextProps.user

  getProjectNotifications: (user) ->
    if @props.project
      talkClient.type('notifications').get({ page: 1, page_size: 1, section: 'project-' + @props.project.id })
        .then (projNotifications) =>
          @setState {projNotifications: projNotifications, loading: false}
    else
      getNotificationProjects(user).then (projNotifications) =>
        @setState {projNotifications: projNotifications, loading: false}

  title: ->
    if @props.project
      "#{ @props.project.display_name } Notifications"
    else if @props.params.section
      "#{ @props.params.section } Notifications"
    else
      'My Notifications'

  onChildChanged: (id) ->
    this.setState({expanded: id})

  render: ->
    <div className="talk notifications">
      <div className="content-container">
        <h3 className={"centering title #{ if @props.project then 'talk-module' else 'notifications-title' }"}>
          {@title()}
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
                    page={this.props.location.query.page}
                    projectID={notification.project_id}
                    singleProject={true if @props.project}
                    slug={notification.project_slug}
                    section={notification.section}
                    user={this.props.user} />
                }
              </div>

            </div>
          else if @state.loading
            <Loading />
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
