ReactDOM = require 'react-dom'
isInBounds = require '../../lib/is-in-bounds'

deleteIfOutOfBounds = (tool) ->
  containerBounds = null
  try
    containerBounds = tool.props.getContainerRect()
  catch
    containerBounds = tool.props.containerRect

  try
    domNode = ReactDOM.findDOMNode tool
    boundingBox = do ->
      {left, top, width, height} = domNode.getBoundingClientRect()
      left += pageXOffset
      top += pageYOffset
      {left, top, width, height}
    outOfBounds = not isInBounds boundingBox, containerBounds
    if outOfBounds
      tool.props.onDestroy()
  catch error
    console.error error

module.exports = deleteIfOutOfBounds
