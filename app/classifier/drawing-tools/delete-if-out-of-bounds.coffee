ReactDOM = require 'react-dom'
isInBounds = require '../../lib/is-in-bounds'

deleteIfOutOfBounds = (tool) ->
  domNode = ReactDOM.findDOMNode tool
  boundingBox = do ->
    {left, top, width, height} = domNode.getBoundingClientRect()
    left += pageXOffset
    top += pageYOffset
    {left, top, width, height}
  outOfBounds = not isInBounds boundingBox, tool.props.containerRect
  if outOfBounds
    tool.props.onDestroy()

module.exports = deleteIfOutOfBounds
