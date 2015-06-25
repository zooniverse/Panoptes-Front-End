React = require 'react'
CollectionsManager = require './manager'
alert = require '../lib/alert'
PromiseRenderer = require '../components/promise-renderer'
ChangeListener = require '../components/change-listener'
auth = require '../api/auth'

# Shows an icon to logged-in users that pops up a collections manager
module?.exports = React.createClass
  displayName: 'CollectionsManagerIcon'

  getDefaultProps: ->
    subject: React.PropTypes.object

  toggleCollectionsManagerPopup: (user) ->
    alert (resolve) =>
      <div className="content-container">
        <CollectionsManager user={user} project={@props.project} subject={@props.subject} onSuccess={resolve} />
      </div>

  render: ->
    <ChangeListener target={auth}>{=>
      <PromiseRenderer promise={auth.checkCurrent()}>{(user) =>
        if user?
          <button
            className="collections-manager-icon"
            onClick={@toggleCollectionsManagerPopup.bind this, user}>
            <i className="fa fa-list" />
          </button>
      }</PromiseRenderer>
    }</ChangeListener>
