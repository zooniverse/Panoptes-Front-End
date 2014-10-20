React = require 'react'

module?.exports = React.createClass
  displayName: 'HoverBox'

  backgroundColor: 'rgb(230, 230, 230)'

  render: ->
    <div className='hover-box' style={
      textAlign: 'center',
      position: 'fixed',
      top: @props.top,
      left: @props.left,
      background: @backgroundColor}>
     {@props.children}
    </div>
