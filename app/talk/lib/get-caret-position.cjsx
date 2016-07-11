textProperties = [
  'direction'
  'boxSizing'
  'width'
  'height'
  'overflowX'
  'overflowY'
  'borderTopWidth'
  'borderRightWidth'
  'borderBottomWidth'
  'borderLeftWidth'
  'borderStyle'
  'paddingTop'
  'paddingRight'
  'paddingBottom'
  'paddingLeft'
  'fontStyle'
  'fontVariant'
  'fontWeight'
  'fontStretch'
  'fontSize'
  'fontSizeAdjust'
  'lineHeight'
  'fontFamily'
  'textAlign'
  'textTransform'
  'textIndent'
  'letterSpacing'
  'wordSpacing'
  'tabSize'
  'MozTabSize'
]

getStyleOf = (element) ->
  if window.getComputedStyle
    getComputedStyle element
  else
    element.currentStyle

# Creates a div to mimic the textarea
mimic = (element, id) ->
  id = "mimic-textarea#{id}"
  div = document.querySelector "##{id}"

  unless div
    div = document.createElement 'div'
    div.id = id
    document.body.appendChild div

  div

# Copy textarea properties to the div
# Returns the computed properties of the textarea
copyTextProps = ({from, to}) ->
  textAreaProps = getStyleOf from
  Object.assign to.style, whiteSpace: 'pre-wrap', position: 'absolute', visibility: 'hidden'
  to.style[prop] = textAreaProps[prop] for prop in textProperties
  textAreaProps

# Copy the textarea contents to the div
# Returns a span at the position of the caret
copyText = ({from, to, at}) ->
  to.textContent = from.value.substring 0, at
  caretSpan = document.createElement 'span'

  # Mark the position of the caret in the div with a span
  caretSpan.textContent = from.value.substring(at) or '&nbsp;'
  to.appendChild caretSpan

# Find the relative bounds of the textarea
getBounds = ({from, container, containing}) ->
  top: from.offsetTop + parseInt container['borderTopWidth']
  bottom: parseInt container.height
  left: from.offsetLeft + parseInt container['borderLeftWidth']
  right: parseInt(container.width) - containing.getBoundingClientRect().width

# Constrain the position to the textarea
constrainedPositionIn = (bounds) ->
  top: Math.min(bounds.top, bounds.bottom)
  left: Math.min(bounds.left, bounds.right)

# Offset the position from the nearest relative parent
relativePosition = ({from, within}) ->
  relativeParent = within.offsetParent
  top: relativeParent.offsetTop + within.offsetTop + from.top
  left: relativeParent.offsetLeft + within.offsetLeft + from.left

# Returns the {top, left} of the caret position within a textarea
module.exports = (id, textArea, popupElement, caretPosition) ->
  div = mimic textArea, id
  textAreaProps = copyTextProps from: textArea, to: div
  caretSpan = copyText from: textArea, to: div, at: caretPosition
  bounds = getBounds from: caretSpan, container: textAreaProps, containing: popupElement
  relativePosition from: constrainedPositionIn(bounds), within: textArea
