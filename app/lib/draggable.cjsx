React = require 'react'

module.exports = React.createClass
  displayName: 'Draggable'

  _previousEventCoords: null

  propTypes:
    onStart: React.PropTypes.oneOfType [
      React.PropTypes.func
      React.PropTypes.bool
    ]
    onDrag: React.PropTypes.func
    onEnd: React.PropTypes.func
    disabled: React.PropTypes.bool

  render: ->
    childProps =
      className: [@props.children.props.className, 'draggable'].filter(Boolean).join ' '

    if @props.disabled
      Object.assign childProps,
      'data-disabled': true
    else
      Object.assign childProps,
        onMouseDown: @handleStart
        onTouchStart: @handleStart

    # NOTE: This won't actually render any new DOM nodes,
    # it just attaches a `mousedown` listener to its child.
    React.cloneElement @props.children, childProps

  _rememberCoords: (e) ->
    @_previousEventCoords =
      x: e.pageX
      y: e.pageY

  handleStart: (e) ->
    e.preventDefault()

    [moveEvent, endEvent] = switch e.type
      when 'mousedown' then ['mousemove', 'mouseup']
      when 'touchstart' then ['touchmove', 'touchend']

    e = e.touches?[0] ? e

    @_rememberCoords e

    # Prefix with this class to switch from `cursor:grab` to `cursor:grabbing`.
    document.body.classList.add 'dragging'

    addEventListener moveEvent, @handleDrag
    addEventListener endEvent, @handleEnd

    # If there's no `onStart`, `onDrag` will be called on start.
    startHandler = @props.onStart ? @handleDrag
    if startHandler # You can set it to `false` if you don't want anything to fire.
      startHandler e

  handleDrag: (e) ->
    e = e.touches?[0] ? e
    d =
      x: e.pageX - @_previousEventCoords.x
      y: e.pageY - @_previousEventCoords.y

    @props.onDrag? e, d

    @_rememberCoords e

  handleEnd: (e) ->
    [moveEvent, endEvent] = switch e.type
      when 'mouseup' then ['mousemove', 'mouseup']
      when 'touchend' then ['touchmove', 'touchend']

    e = e.touches?[0] ? e

    removeEventListener moveEvent, @handleDrag
    removeEventListener endEvent, @handleEnd

    @props.onEnd? e

    @_previousEventCoords = null

    document.body.classList.remove 'dragging'
