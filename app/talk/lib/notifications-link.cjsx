React = require 'react'
{Link} = require 'react-router'
apiClient = require 'panoptes-client/lib/api-client'
talkClient = require 'panoptes-client/lib/talk-client'

module.exports = React.createClass
  displayName: 'NotificationsLink'

  contextTypes:
    unreadNotificationsCount: React.PropTypes.number

  label: ->
    if @context.unreadNotificationsCount > 0
      <i className="fa fa-bell fa-fw" />
    else
      <i className="fa fa-bell-o fa-fw" />

  ariaLabel: ->
    if @context.unreadNotificationsCount > 0
      "Notifications (#{ @context.unreadNotificationsCount } unread)"
    else
      'Notifications'

  render: ->
    return null unless @props.user and @context.unreadNotificationsCount?

    {owner, name} = @props.params
    linkProps = @props.linkProps
    linkProps['aria-label'] = @ariaLabel()

    if owner and name
      <Link to="/projects/#{owner}/#{name}/notifications" {...linkProps}>{@label()}</Link>
    else
      <Link to="/notifications" {...linkProps}>{@label()}</Link>
