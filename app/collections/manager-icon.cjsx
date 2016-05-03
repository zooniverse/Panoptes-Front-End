React = require 'react'
CollectionsManager = require './manager'
Dialog = require 'modal-form/dialog'

# Shows an icon to logged-in users that pops up a collections manager
module?.exports = React.createClass
  displayName: 'CollectionsManagerIcon'

  propTypes:
    subject: React.PropTypes.object
    user: React.PropTypes.object

  getInitialState: ->
    open: false

  render: ->
    <button
      className="collections-manager-icon"
      title="Collect"
      onClick={@setState.bind this, {open: true}, null}>
      <i className="fa fa-list" />

      {if @state.open
        <Dialog tag="div">
          <CollectionsManager user={@props.user} project={@props.project} subject={@props.subject} onSuccess={@setState.bind this, {open: false}, null} />
        </Dialog>}
    </button>
