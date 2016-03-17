React = require 'react'
Tooltip = require '../components/tooltip'

module.exports = React.createClass
  displayName: 'WarningBanner'
  
  getInitialState: ->
    showWarning: false
  
  toggleWarning: ->
    @setState showWarning: not @state.showWarning

  render: ->
    <button type="button" className="warning-banner" onClick={@toggleWarning}>
      {@props.label}
      {if @state.showWarning
        <Tooltip attachment="top left" targetAttachment="middle right">
          {@props.children}
        </Tooltip>}
    </button>