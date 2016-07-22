React = require 'react'
NotificationsLink = require './notifications-link'

module.exports = React.createClass
  displayName: 'SidebarNotifications'

  render: ->
    <section className="talk-sidebar-notifications">
      <h3>
        <NotificationsLink {...@props} linkProps={className: 'sidebar-link'} />
      </h3>
    </section>
