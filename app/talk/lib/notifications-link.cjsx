React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
{Link} = require 'react-router'
apiClient = require 'panoptes-client/lib/api-client'
talkClient = require 'panoptes-client/lib/talk-client'
Translate = require 'react-translate-component'
counterpart = require 'counterpart'
classnames = require 'classnames'

counterpart.registerTranslations 'en',
  notificationsLink:
    notifications: 'Notifications'

module.exports = createReactClass
  displayName: 'NotificationsLink'

  contextTypes:
    unreadNotificationsCount: PropTypes.number

  label: ->
    unread = @context.unreadNotificationsCount
    count = if (unread and unread < 100) then unread else "99+"
    rootClasses = classnames('site-nav__inbox-link', {
      'site-nav__inbox-link--unread': unread
    })

    if @props.isMobile && @context.unreadNotificationsCount > 0
      <i className="fa fa-bell fa-fw" />
    else if @props.isMobile
      <i className="fa fa-bell-o fa-fw" />
    else
      <span className={rootClasses}>
        <Translate content="notificationsLink.notifications" />
        {if unread
          " (#{count})"
        }
      </span>

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
