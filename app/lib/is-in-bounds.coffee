isInBounds = (object, bounds) ->
  notBeyondLeft = object.left + object.width > bounds.left
  notBeyondRight = object.left < bounds.left + bounds.width
  notBeyondTop = object.top + object.height > bounds.top
  notBeyondBottom = object.top < bounds.top + bounds.height
  notBeyondLeft and notBeyondRight and notBeyondTop and notBeyondBottom

module.exports = isInBounds
