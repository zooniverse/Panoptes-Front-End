React = require 'react'
TriggeredModalForm = require 'modal-form/triggered'

module.exports = React.createClass
  displayName: 'WarningBanner'

  render: ->
    <TriggeredModalForm trigger={@props.label} triggerProps={className: 'warning-banner'}>
      {@props.children}
    </TriggeredModalForm>
