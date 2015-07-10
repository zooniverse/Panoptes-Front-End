React = require 'react'
CollectionsManager = require './manager'
alert = require '../lib/alert'

# Shows an icon to logged-in users that pops up a collections manager
module?.exports = React.createClass
  displayName: 'CollectionsManagerIcon'

  toggleCollectionsManagerPopup: ->
    alert (resolve) =>
      <div className="content-container">
        <CollectionsManager user={@props.user} project={@props.project} subject={@props.subject} onSuccess={resolve} />
      </div>

  render: ->
    <button
      className="collections-manager-icon"
      onClick={@toggleCollectionsManagerPopup}>
      <i className="fa fa-list" />
    </button>
