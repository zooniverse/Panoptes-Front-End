React = require 'react'
CollectionsManager = require './manager'
alert = require '../lib/alert'

module?.exports = React.createClass
  displayName: 'CollectionsManagerIcon'

  getDefaultProps: ->
    subject: React.PropTypes.object

  toggleCollectionsManagerPopup: ->
    alert (resolve) =>
      <div className="content-container">
        <CollectionsManager subject={@props.subject} />
      </div>

  render: ->
    <button
      className="collections-manager-icon"
      onClick={@toggleCollectionsManagerPopup}>
      <i className="fa fa-list" />
    </button>
