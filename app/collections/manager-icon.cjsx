React = require 'react'
CollectionsManager = require './manager'
Dialog = require 'modal-form/dialog'

# Shows an icon to logged-in users that pops up a collections manager
module.exports = React.createClass
  displayName: 'CollectionsManagerIcon'

  propTypes:
    subject: React.PropTypes.object
    user: React.PropTypes.object

  getInitialState: ->
    open: false

  open: ->
    @setState {open: true}

  close: ->
    @setState {open: false}

  render: ->
    <button
      className="collections-manager-icon #{@props.className ? ''}"
      title="Collect"
      onClick={@open}>
      <i className="fa fa-list fa-fw" />

      {if @state.open
        <Dialog tag="div" closeButton={true} onCancel={@close}>
          <CollectionsManager user={@props.user} project={@props.project} subject={@props.subject} onSuccess={@close} />
        </Dialog>}
    </button>
