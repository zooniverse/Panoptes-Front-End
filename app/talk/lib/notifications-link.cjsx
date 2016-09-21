React = require 'react'
{Link} = require 'react-router'
apiClient = require 'panoptes-client/lib/api-client'
talkClient = require 'panoptes-client/lib/talk-client'

module.exports = React.createClass
  displayName: 'NotificationsLink'

  componentWillReceiveProps: (nextProps) ->
    return unless nextProps.user
    {owner, name} = nextProps.params
    if owner isnt @state.owner and name isnt @state.name
      @setSection(owner, name).then =>
        @getUndeliveredCount()

  getInitialState: ->
    unreadCount: null
    section: null
    owner: null
    name: null

  setSection: (owner, name) ->
    if owner and name
      apiClient.type('projects').get(slug: "#{owner}/#{name}").then ([project]) =>
        section = "project-#{project.id}"
        @setState {owner, name, section}
    else
      Promise.resolve().then =>
        section = null
        @setState {owner, name, section}

  getUndeliveredCount: ->
    query =
      delivered: false
      page_size: 1

    query.section = @state.section if @state.section
    talkClient.type('notifications').get(query).then (notifications) =>
      unreadCount = notifications[0]?.getMeta()?.count or 0
      @setState {unreadCount}

  label: ->
    if @state.unreadCount > 0
      <i className="fa fa-bell fa-fw" />
    else
      <i className="fa fa-bell-o fa-fw" />

  ariaLabel: ->
    if @state.unreadCount > 0
      "Notifications (#{ @state.unreadCount } unread)"
    else
      'Notifications'

  render: ->
    return null unless @props.user and @state.unreadCount?

    {section, owner, name} = @state
    linkProps = @props.linkProps
    linkProps['aria-label'] = @ariaLabel()

    if owner and name
      <Link to="/projects/#{owner}/#{name}/notifications" {...linkProps}>{@label()}</Link>
    else
      <Link to="/notifications" {...linkProps}>{@label()}</Link>
