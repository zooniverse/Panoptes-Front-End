# @cjsx React.DOM

React = require 'react'
cloneWithProps = require 'react/lib/cloneWithProps'

module.exports = React.createClass
  displayName: 'Draggable'

  propTypes:
    children: React.PropTypes.component.isRequired

  render: ->
    cloneWithProps @props.children,
      onMouseDown: @handleStart

  handleStart: (e) ->
    e.preventDefault()
    startHandler = @props.onStart ? @handleMove
    startHandler e
    document.addEventListener 'mousemove', @handleMove
    document.addEventListener 'mouseup', @handleEnd
    document.body.classList.add 'dragging'

  handleMove: (e) ->
    @props.onDrag? e

  handleEnd: (e) ->
    @props.onEnd? e
    document.removeEventListener 'mousemove', @handleMove
    document.removeEventListener 'mouseup', @handleEnd
    document.body.classList.remove 'dragging'
