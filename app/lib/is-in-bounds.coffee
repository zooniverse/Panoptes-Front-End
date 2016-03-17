isInBounds = (rect, bounds) ->
  goodTop = rect.top < bounds.top + bounds.height
  goodRight = rect.left + rect.width > bounds.left
  goodBottom = rect.top + rect.height > bounds.top
  goodLeft = rect.left < bounds.left + bounds.width
  goodTop and goodRight and goodBottom and goodLeft

module.exports = isInBounds
