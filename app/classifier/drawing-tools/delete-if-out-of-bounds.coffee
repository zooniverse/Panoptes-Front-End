ReactDOM = require 'react-dom'
isInBounds = require '../../lib/is-in-bounds'

deleteIfOutOfBounds = (tool) ->
  domNode = ReactDOM.findDOMNode tool
  boundingBox = domNode.getBoundingClientRect()
  outOfBounds = not isInBounds boundingBox, tool.props.containerRect
  if outOfBounds
    tool.props.onDestroy()

module.exports = deleteIfOutOfBounds
