React = require 'react'

module?.exports = React.createClass
  displayName: 'HoverBox'

  width: 120
  height: 80
  topOffset: 5
  backgroundColor: 'rgb(230, 230, 230)'

  render: ->
    <div className='hover-box' style={
      display: @props.display,
      textAlign: 'center',
      width: @width,
      position: 'fixed',
      top: (@props.top - (@height / 2 + @topOffset)),
      left: (@props.left - (@width / 2)) + @props.targetRadius,
      background: @backgroundColor}>

      <p>{@props.content}</p>

    </div>
