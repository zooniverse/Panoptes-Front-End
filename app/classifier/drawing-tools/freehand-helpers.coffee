createPathFromCoords = (coordsArray) ->
  [firstCoord, otherCoords...] = coordsArray
  path = "M #{firstCoord.x},#{firstCoord.y} "
  path += "L #{x},#{y} " for {x, y} in otherCoords
  path

module.exports = 
  createPathFromCoords: createPathFromCoords
