React = require 'react'

module.exports = React.createClass
  displayName: 'dialog'

  open: ->
    @setState open: true

  close: ->
    @setState open: false

  render: ->
    @transferPropsTo if @props.open
      <div className="dialog-underlay">
        <div className="dialog-content">
          {@props.children}
        </div>
      </div>
    else
      <noscript></noscript>
