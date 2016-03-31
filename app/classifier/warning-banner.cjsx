React = require 'react'
TriggeredModalForm = require 'modal-form/triggered'

module.exports = (props) ->
    <TriggeredModalForm trigger={props.label} triggerProps={className: 'warning-banner'}>
      {props.children}
    </TriggeredModalForm>
