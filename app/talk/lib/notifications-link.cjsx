React = require 'react'
{Link} = require 'react-router'
talkClient = require 'panoptes-client/lib/talk-client'
formatNumber = require './format-number'

module.exports = React.createClass
  displayName: 'NotificationsLink'

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
      "Notifications (#{ formatNumber @state.unreadCount })"
    else
      'Notifications'

  render: ->
    return null unless @props.user and @state.unreadCount?

    {project, user} = @props
    {section, owner, name} = @props?.params or { }
    section or= @props.section

    linkProps = Object.assign { }, @props.linkProps, {project, section, user}
    linkParams = {section, owner, name}

    if project
      <Link to="/projects/#{owner}/#{name}/notifications" {...linkProps}>{@label()}</Link>
    else if section
      <Link to="/#{section}/notifications" {...linkProps}>{@label()}</Link>
    else
      <Link to="/notifications" {...linkProps}>{@label()}</Link>
