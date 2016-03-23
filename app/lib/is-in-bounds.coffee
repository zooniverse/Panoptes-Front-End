isInBounds = (rect, bounds) ->
  notBeyondLeft = rect.left + rect.width > bounds.left
  notBeyondRight = rect.left < bounds.left + bounds.width
  notBeyondTop = rect.top + rect.height > bounds.top
  notBeyondBottom = rect.top < bounds.top + bounds.height
  notBeyondLeft and notBeyondRight and notBeyondTop and notBeyondBottom

module.exports = isInBounds
