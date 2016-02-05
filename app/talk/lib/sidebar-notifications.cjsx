React = require 'react'
{Link} = require 'react-router'
talkClient = require 'panoptes-client/lib/talk-client'
resourceCount = require './resource-count'
formatNumber = require './format-number'

module?.exports = React.createClass
  displayName: 'SidebarNotifications'

  componentDidMount: ->
    @getUndeliveredCount() if @props.user

  componentWillReceiveProps: ->
    @getUndeliveredCount() if @props.user

  getInitialState: ->
    unreadCount: null

  getUndeliveredCount: ->
    delivered = false
    page_size = 1
    section = @props.section
    section = "project-#{ @props.project.id }" if @props.project
    talkClient.type('notifications').get({section, delivered, page_size}).then (notifications) =>
      unreadCount = notifications[0]?.getMeta()?.count or 0
      @setState {unreadCount}

  label: ->
    if @state.unreadCount > 0
      "Notifications (#{ formatNumber @state.unreadCount } unread)"
    else
      'Notifications'

  render: ->
    return null unless @props.user and @state.unreadCount?

    {project, user} = @props
    {section, owner, name} = @props.params
    section or= @props.section

    linkProps = {project, section, user}
    linkParams = {section, owner, name}

    <section className="talk-sidebar-notifications">
      <h3>
        {if project
          <Link to="/projects/#{owner}/#{name}/notifications" {...linkProps} className="sidebar-link">{@label()}</Link>
        else if section
          <Link to="/#{section}/notifications" {...linkProps} className="sidebar-link">{@label()}</Link>
        else
          <Link to="/notifications" {...linkProps} className="sidebar-link">{@label()}</Link>}
      </h3>
    </section>
