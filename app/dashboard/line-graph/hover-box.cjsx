React = require 'react'

module?.exports = React.createClass
  displayName: 'HoverBox'

  render: ->
    <div className='hover-box' style={
      top: @props.top,
      left: @props.left,}>
     {@props.children}
    </div>
