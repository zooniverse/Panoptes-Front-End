createPathFromCoords = (coordsArray) ->
  [firstCoord, otherCoords...] = coordsArray
  path = "M #{firstCoord.x},#{firstCoord.y} "
  path += "L #{x},#{y} " for {x, y} in otherCoords
  path

filterDupeCoords = (coordsArray) ->
  coordsArray.reduce (filtered, current, index) ->
    previous = coordsArray[index - 1] or false
    filtered.push current unless previous and (previous.x is current.x and previous.y is current.y)
    filtered
  , []

module.exports =
  createPathFromCoords: createPathFromCoords
  filterDupeCoords: filterDupeCoords
