ReactDOM = require 'react-dom'
DeleteButton = require './delete-button'

isInBounds = ({top, left, width, height}, bounds) ->
  goodTop = top < bounds.top + bounds.height
  goodRight = left + width > bounds.left
  goodBottom = top + height > bounds.top
  goodLeft = left < bounds.left + bounds.width
  goodTop and goodRight and goodBottom and goodLeft

deleteIfOutOfBounds = (tool) ->
  domNode = ReactDOM.findDOMNode tool
  boundingBox = domNode.getBoundingClientRect()
  outOfBounds = not isInBounds boundingBox, tool.props.containerRect
  if outOfBounds
    tool.props.onDestroy()

module.exports = deleteIfOutOfBounds
