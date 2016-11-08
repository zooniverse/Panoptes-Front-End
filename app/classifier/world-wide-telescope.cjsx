React = require 'react'
crypto = require 'crypto'

class SimplePoint
  constructor: (@x, @y) ->

class AxisLabel
  constructor: (annotation) ->
    {@x, @y} = annotation
    @value = annotation.details[0].value

class AxisPoint
  constructor: (annotation) ->
    {@x, @y} = annotation
    @value = annotation.details[0].value

class Axis
  @RA: 0
  @RA1950: 1
  @DEC: 2
  @DEC1950: 3
  @GLAT: 4
  @GLON: 5

  constructor: (@range, @unit) ->

class StarChart
  @GALACTIC: 0
  @EQUATORIAL: 1
  @OTHER: 2

  constructor: (annotation) ->
    {@width, @height, @x, @y} = annotation
    @corners = ((new SimplePoint pt[0], pt[1]) for pt in [ [@x, @y], [@x, @y + @height], [@x + @width, @y], [@x + @width, @y + @height] ])
    @axisPoints = []
    @axisLabels = []
    @valid = false

  bounds: ->
    x: [@x, @x + @width]
    y: [@y, @y + @height]

  calculateDistance: (p1, p2) ->
    Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))

  closestCornerDistance: (p) ->
    chart: this
    distance: (Math.min.apply null, ((@calculateDistance p, corner) for corner in @corners))

  calculateMidpoints: ->
    @midpoints = []
    for p1 in @axisPoints
      for p2 in @axisPoints
        if p1 isnt p2
          @midpoints.push
            x: (p1.x + p2.x) / 2
            y: (p1.y + p2.y) / 2

  closestMidpointDistance: (p) ->
    @calculateMidpoints() unless @midpoints?
    result =
      chart: this
      distance: Math.min.apply null, ((@calculateDistance p, midpoint) for midpoint in @midpoints)

  addAxisPoint: (axisPoint) ->
    @axisPoints.push axisPoint

  addAxisLabel: (axisLabel) ->
    @axisLabels.push axisLabel

  findAxis: (points) ->
    xSlope = Infinity
    ySlope = 0
    xAxis = null
    yAxis = null
    for pointA in points
      for pointB in points
        if Math.abs(@slope(pointA, pointB)) < xSlope
          xSlope = Math.abs(@slope(pointA, pointB))
          xAxis = [pointA, pointB]
        if Math.abs(@slope(pointA, pointB)) > ySlope
          ySlope = Math.abs(@slope(pointA, pointB))
          yAxis = [pointA, pointB]
    xAxis: xAxis
    yAxis: yAxis

  slope: (pointA, pointB) ->
    (pointA.y - pointB.y) / (pointA.x - pointB.x)

  findLabels: (range, labels) ->
    midpoint = {x: (range[0].x + range[1].x) / 2, y: (range[1].y + range[1].y) / 2}
    label = null
    distance = Infinity
    for point in labels
      if @calculateDistance(midpoint, point) < distance
        label = point
        distance = @calculateDistance(midpoint, point)
    label

  buildAxes: ->
    if @axisPoints.length >= 3 && @axisLabels.length >= 2
      @valid = true
      xRange = (@findAxis @axisPoints).xAxis.sort( (a, b) -> a.x > b.x )
      yRange = (@findAxis @axisPoints).yAxis.sort( (a, b) -> a.y > b.y )
      xLabel = @findLabels xRange, @axisLabels
      yLabel = @findLabels yRange, @axisLabels
      @xAxis = new Axis xRange, xLabel.value
      @yAxis = new Axis yRange, yLabel.value

  coordinateSystem: ->
    coords = StarChart.OTHER
    if (@xAxis.unit == Axis.RA && @yAxis.unit == Axis.DEC) || (@xAxis.unit == Axis.DEC && @yAxis.unit == Axis.RA)
      coords = StarChart.EQUATORIAL
    if (@xAxis.unit == Axis.RA1950 && @yAxis.unit == Axis.DEC1950) || (@xAxis.unit == Axis.DEC1950 && @yAxis.unit == Axis.RA1950)
      coords = StarChart.EQUATORIAL
    if (@xAxis.unit == Axis.GLAT && @yAxis.unit == Axis.GLON) || (@xAxis.unit == Axis.GLON && @yAxis.unit == Axis.GLAT)
      coords = StarChart.GALACTIC
    coords

class Plate
  constructor: (@starChart, @url) ->
    @imageBounds = @starChart.bounds()
    [xRange, yRange] = [@starChart.xAxis.range, @starChart.yAxis.range]

    @xyCorners = [
      new SimplePoint(xRange[0].x, yRange[0].y), new SimplePoint(xRange[1].x, yRange[0].y),
      new SimplePoint(xRange[1].x, yRange[1].y), new SimplePoint(xRange[0].x, yRange[1].y)
    ]

    makeStarCoord = if @starChart.coordinateSystem() == StarChart.EQUATORIAL then StarCoord.fromRaDec else StarCoord.fromGlatGlon
    xAxisDec = if @starChart.xAxis.unit == Axis.DEC || @starChart.xAxis.unit == Axis.DEC1950 || @starChart.xAxis.unit == Axis.GLAT then true else false
    epoch1950 = if @starChart.xAxis.unit == Axis.DEC1950 || @starChart.xAxis.unit == Axis.RA1950 then true else false
    @fullValues xRange
    @fullValues yRange
    @coordCorners = [
      makeStarCoord(xRange[0].value, yRange[0].value, xAxisDec, epoch1950), makeStarCoord(xRange[1].value, yRange[0].value, xAxisDec, epoch1950),
      makeStarCoord(xRange[1].value, yRange[1].value, xAxisDec, epoch1950), makeStarCoord(xRange[0].value, yRange[1].value, xAxisDec, epoch1950)
    ]

  fullValues: (ranges) ->
    firstValue = ranges[0].value.match(/(-)?\d+(?:\.\d+)?/g)
    secondValue = ranges[1]?.value.match(/(-)?\d+(?:\.\d+)?/g)
    difference = Math.abs(firstValue.length - secondValue?.length)
    if difference > 0 && secondValue
      longerNumber = if firstValue.length > secondValue.length then firstValue else secondValue
      shorterNumber = if secondValue.length < firstValue.length then secondValue else firstValue
      index = 0
      until longerNumber.length == shorterNumber.length
        shorterNumber.splice(index, 0, longerNumber[index])
        index = index + 1
      [ranges[0].value, ranges[1].value] = [firstValue.join(" "), secondValue.join(" ")]

  scale: ->
    [star1, star2] = [ @coordCorners[0], @coordCorners[2] ]
    [xy1, xy2] = [ @xyCorners[0], @xyCorners[2] ]
    averageDec = (star1.dec + star2.dec) / 2
    deltaRA = ((star2.ra - star1.ra) * Math.cos(averageDec * Math.PI/180)) * 3600
    deltaDec = (star2.dec - star1.dec) * 3600
    angularSep = Math.sqrt(Math.pow(deltaRA, 2) + Math.pow(deltaDec, 2))
    pixelSep = Math.sqrt(Math.pow(xy1.x - xy2.x, 2) + Math.pow(xy1.y - xy2.y, 2))
    angularSep / pixelSep

  centerCoords: ->
    s = @starChart
    upperY = s.height - (s.yAxis.range[0].y - s.corners[0].y)
    lowerY = s.corners[3].y - s.yAxis.range[1].y
    center =
      x: ((s.xAxis.range[0].x - s.corners[0].x) + (s.xAxis.range[1].x - s.corners[0].x)) / 2
      y: (upperY + lowerY) / 2
      ra: (@coordCorners[0].ra + @coordCorners[2].ra) / 2
      dec: (@coordCorners[0].dec + @coordCorners[2].dec) / 2
    center

  getCropUrl: ->
    url = @url.replace(/^https?\:\/\//i, "")
    # TODO: we need to account for the fact that the size of the image might be different than
    # the size that it is displayed
    "http://imgproc.zooniverse.org/crop/#{@starChart.width}/#{@starChart.height}/#{@starChart.x}/#{@starChart.y}?u=#{url}"

  computeRotation: ->
    if @starChart.xAxis.unit == Axis.RA || @starChart.xAxis.unit == Axis.RA1950 || @starChart.xAxis.unit == Axis.GLON
    then 180
    else 90

  computeName: ->
    crypto.createHash('md5').update(new Date().toString()).digest('hex').slice(0, 10)

  getWwtUrl: ->
    base = "http://www.worldwidetelescope.org/wwtweb/ShowImage.aspx"
    rotation = @computeRotation()
    name = @computeName()
    center = @centerCoords()
    "#{base}?name=#{name}&ra=#{center.ra}&dec=#{center.dec}&x=#{center.x}&y=#{center.y}&scale=#{@scale()}&rotation=#{rotation}&imageurl=#{@getCropUrl()}"

class StarCoord
  constructor: (@ra, @dec) ->

  s = StarCoord

  @fromRaDec: (xAxis, yAxis, xAxisDec, epoch1950) ->
    if xAxisDec == true
      ra = yAxis
      dec = xAxis
    else
      ra = xAxis
      dec = yAxis
    ra = StarCoord._parseDegrees(ra, false)
    dec = StarCoord._parseDegrees(dec, true)
    [ra, dec] = StarCoord._epochConvert(ra, dec) if epoch1950 is true
    new StarCoord ra, dec

  @fromGlatGlon: (xAxis, yAxis, xAxisGlat, epoch1950) ->
    if xAxisGlat == true
      glat = xAxis
      glon = yAxis
    else
      glon = xAxis
      glat = yAxis
    glat = glat.replace(/[^\d.-]/g,'')
    glon = glon.replace(/[^\d.-]/g,'')
    [b, l, pole_ra, pole_dec, posangle] = [ s._toRadians(glat), s._toRadians(glon), s._toRadians(192.859508), s._toRadians(27.128336), s._toRadians(122.932-90.0) ]
    ra = s._toDegrees(Math.atan2((Math.cos(b) * Math.cos(l - posangle)), (Math.sin(b) * Math.cos(pole_dec) - Math.cos(b) * Math.sin(pole_dec) * Math.sin(l-posangle))) + pole_ra)
    dec = s._toDegrees(Math.asin(Math.cos(b) * Math.cos(pole_dec) * Math.sin(l - posangle) + Math.sin(b) * Math.sin(pole_dec)))
    new StarCoord ra, dec

  @_epochConvert: (ra, dec) ->
    RA2000 = ra + 0.640265 + 0.278369 * Math.sin(@_toDegrees(ra)) * Math.tan(@_toDegrees(dec))
    DEC2000 = dec + 0.278369 * Math.cos(@_toDegrees(ra))
    [RA2000, DEC2000]

  @_toRadians: (degrees) -> degrees * Math.PI / 180.0

  @_toDegrees: (radians) -> radians * 180.0 / Math.PI

  @_parseDegrees: (str, dec) ->
    return parseFloat str unless isNaN str

    isNeg = false
    reg = ///
    (?:
    (-)?                  # leading minus sign, if present
    (\d+(?:\.\d+)?))      # a number that may or may not have decimal digits
    (?:
    \D+                   # one or more non-numeric digits (not captured)
    (\d+(?:\.\d+)?))      # a number that may or may not have decimal digits
    ?                     # this term is optional
    (?:
    \D+                   # one or more non-numeric digits (not captured)
    (\d+(?:\.\d+)?))      # a number that may or may not have decimal digits
    ?                     # this term is optional
    ///
    match = reg.exec str
    isNeg = match[1] == '-'
    match.shift()
    if dec == true
      s._decConvert(match, isNeg)
    else
      s._raConvert(match, isNeg)

  @_raConvert: (match, isNeg) ->
    (parseInt(match[1], 10) * 15 +
    (parseInt(match[2], 10) / 4 || 0) +
    (parseInt(match[3]) / 240 || 0)) *
    if isNeg then -1 else 1

  @_decConvert: (match, isNeg) ->
    (parseInt(match[1], 10) +
    (parseInt(match[2], 10) / 60 || 0) +
    (parseInt(match[3]) / 3600 || 0)) *
    if isNeg then -1 else 1

module.exports = React.createClass
  displayName: 'WorldWideTelescope'

  parseClassification: ->
    telescopeAnnotations = []
    @props.annotations.map (annotation) =>
      if @props.workflow.tasks[annotation.task].type is 'drawing'
        annotation.type = @props.workflow.tasks[annotation.task].type
        telescopeAnnotations.push(annotation)

    # parse chart rectangles
    @charts = ((new StarChart annotation) for annotation in telescopeAnnotations[0].value)

    # assign axis points to charts
    for annotation in telescopeAnnotations[1].value
      point = new AxisPoint annotation
      distances = ((chart.closestCornerDistance point) for chart in @charts)
      closest = distances.sort((a, b) -> a.distance > b.distance)[0].chart
      closest.addAxisPoint point

    # assign axis labels to charts
    for annotation in telescopeAnnotations[2].value
      label = new AxisLabel annotation
      distances = ((chart.closestMidpointDistance label) for chart in @charts)
      closest = distances.sort((a, b) -> a.distance > b.distance)[0].chart
      closest.addAxisLabel label

    for chart in @charts
      chart.buildAxes()

  render: ->
    subjImage = @props.subject.locations[0]["image/jpeg"]
    plates = []

    try
      @parseClassification()

      for chart in @charts
        if chart.valid
          plates.push(new Plate(chart, subjImage))

    <div>
      {plates.map (plate, idx) ->
        <div key={idx}>
        <p>View Your Classification in the WorldWide Telescope!</p>
        <img className="chart-image" src={"#{plate.getCropUrl()}"}/>
        <a target="_blank" href={plate.getWwtUrl()} className='telescope-button standard-button'>World Wide Telescope</a>
        </div>
      }
    </div>
