React = require 'react'
{Link} = require 'react-router'
apiClient = require 'panoptes-client/lib/api-client'
talkClient = require 'panoptes-client/lib/talk-client'
Translate = require 'react-translate-component'
counterpart = require 'counterpart'

counterpart.registerTranslations 'en',
  notificationsLink:
    notifications: 'Notifications'

module.exports = React.createClass
  displayName: 'NotificationsLink'

  contextTypes:
    unreadNotificationsCount: React.PropTypes.number

  label: ->
    <Translate content="notificationsLink.notifications" />

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
