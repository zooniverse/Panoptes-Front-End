React = require 'react'
ReactDOM = require 'react-dom'

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
  @DEC: 1
  @GLAT: 2
  @GLONG: 3
  constructor: (@range, @unit) ->

class StarChart
  @GALACTIC: 0
  @EQUATORIAL: 1
  @OTHER: 2
  constructor: (annotation) ->
    {@width, @height, @x, @y} = annotation
    @corners = ((new SimplePoint pt[0], pt[1]) for pt in [ [@x, @y], [@x, @y+@height], [@x+@width, @y], [@x+@width, @y+@height] ])
    @axisPoints = []
    @axisLabels = []
  bounds: ->
    x: [@x, @x+@width]
    y: [@y, @y+@height]
  calculateDistance: (p1, p2) ->
    Math.sqrt(Math.pow(p1.x-p2.x,2)+Math.pow(p1.y-p2.y,2))
  closestCornerDistance: (p) ->
    chart: this
    distance: (Math.min.apply null, ((@calculateDistance p, corner) for corner in @corners))
  calculateMidpoints: ->
    @midpoints = []
    for p1 in @axisPoints
      for p2 in @axisPoints
        if p1 isnt p2
          @midpoints.push
            x: (p1.x+p2.x)/2
            y: (p1.y+p2.y)/2
  closestMidpointDistance: (p) ->
    @calculateMidpoints() unless @midpoints?
    result =
      chart: this
      distance: Math.min.apply null, ((@calculateDistance p, midpoint) for midpoint in @midpoints)
  addAxisPoint: (axisPoint) ->
    @axisPoints.push axisPoint
  addAxisLabel: (axisLabel) ->
    @axisLabels.push axisLabel
  filterBounds: (items, prop, bounds) ->
    (i for i in items when i[prop] < bounds[prop][0] || i[prop] > bounds[prop][1])
  buildAxes: ->
    bounds = @bounds()
    xLabel = (@filterBounds @axisLabels, 'y', bounds)[0]
    yLabel = (@filterBounds @axisLabels, 'x', bounds)[0]
    xRange = (@filterBounds @axisPoints, 'y', bounds).sort( (a,b) -> a.x > b.x ).slice(0,2)
    yRange = (@filterBounds @axisPoints, 'x', bounds).sort( (a,b) -> a.y > b.y ).slice(0,2)

    @xAxis = new Axis xRange, xLabel.value
    @yAxis = new Axis yRange, yLabel.value
  coordinateSystem: ->
    coords = StarChart.OTHER
    coords = StarChart.EQUATORIAL if (@xAxis.unit == Axis.RA && @yAxis.unit == Axis.DEC) || (@xAxis.unit == Axis.DEC && @yAxis.unit == Axis.RA)
    coords = StarChart.GALACTIC if (@xAxis.unit == Axis.GLAT && @yAxis.unit == Axis.GLON) || (@xAxis.unit == Axis.GLON && @yAxis.unit == Axis.GLAT)
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
    @coordCorners = [
      makeStarCoord(xRange[0].value, yRange[0].value), makeStarCoord(xRange[1].value, yRange[0].value),
      makeStarCoord(xRange[1].value, yRange[1].value), makeStarCoord(xRange[0].value, yRange[1].value)
    ]
  scale: ->
    [star1, star2] = [ @coordCorners[0], @coordCorners[2] ]
    [xy1, xy2] = [ @xyCorners[0], @xyCorners[2] ]
    averageDec = (star1.dec + star2.dec) / 2
    deltaRA = ((star2.ra - star1.ra) * Math.cos(averageDec * Math.PI/180)) * 3600
    deltaDec = (star2.dec - star1.dec) * 3600
    angularSep = Math.sqrt(Math.pow(deltaRA,2) + Math.pow(deltaDec,2))
    pixelSep = Math.sqrt(Math.pow(xy1.x - xy2.x,2) + (Math.pow(xy1.y-xy2.y, 2)))
    angularSep / pixelSep
  #TODO: this is over-simplified; no guarantee the center of the plate is the center of the plot
  centerCoords: ->
    center =
      x: (@xyCorners[0].x + @xyCorners[2].x) / 2
      y: (@xyCorners[0].y + @xyCorners[2].y) / 2
      ra: (@coordCorners[0].ra + @coordCorners[2].ra) / 2
      dec: (@coordCorners[0].dec + @coordCorners[2].dec) / 2
    center
  getCropUrl: ->
    # sampleUrl = "panoptes-uploads.zooniverse.org/production/subject_location/90a3b642-55e2-4583-a4fb-2f0abeb5b285.jpeg"
    url = ''
    corner = @xyCorners[0]
    # TODO: we need to account for the fact that the size of the image might be different than
    # the size that it is displayed
    "http://imgproc.zooniverse.org/crop?w=#{starChart.width}&h=#{starChart.height}&x=#{corner.x}&y=#{corner.y}&u=#{@url}"
  computeRotation: ->
    if @starChart.xAxis == Axis.RA || @starChart.xAxis == Axis.GLAT then 0 else 90
  computeName: ->
    #TODO: Must create unique names
    "Horsehead"
  getWwtUrl: ->
    base = "http://www.worldwidetelescope.org/wwtweb/ShowImage.aspx"
    rotation = @computeRotation()
    name = @computeName()
    center = @centerCoords()
    sampleUrl = "http://antwrp.gsfc.nasa.gov/apod/image/0811/horsehead_caelum.jpg"
    #TODO: this should be @getCropUrl() once we figure out why wwt is angry about query params
    "#{base}?name=#{name}&ra=#{center.ra}&dec=#{center.dec}&x=#{center.x}&y=#{center.y}&scale=#{@scale()}&rotation=#{rotation}&imageurl=#{sampleUrl}"

class StarCoord
  constructor: (@ra, @dec) ->

  s = StarCoord

  @fromRaDec: (ra, dec) -> new StarCoord ra, dec
  @fromGlatGlon: (glat,glon) ->
    [ra, dec] = StarCoord._toEquatorial glat, glon
    new StarCoord ra, dec

  @_toEquatorial: (glat, glon) ->
    [b, l, pole_ra, pole_dec, posangle] = s._toRadians deg for deg in [ glat, glon, 192.859508, 27.128336, 122.932-90.0 ]
    ra = s._toDegrees(Math.atan2((Math.cos(b)*Math.cos(l-posangle)), (Math.sin(b)*Math.cos(pole_dec) - Math.cos(b)*Math.sin(pole_dec)*Math.sin(l-posangle))) + pole_ra)
    dec = s._toDegrees(Math.asin(Math.cos(b)*Math.cos(pole_dec)*Math.sin(l-posangle)+Math.sin(b)*Math.sin(pole_dec)))
    new StarCoord(ra, dec)

  @_toRadians: (degrees) -> degrees * Math.PI / 180.0
  @_toDegrees: (radians) -> radians * 180.0 / Math.PI

module.exports = React.createClass
  displayName: 'WorldWideTelescope'

  parseClassification: ->
    # parse chart rectangles
    @charts = ((new StarChart annotation) for annotation in @props.classification[1].value)

    # assign axis points to charts
    for annotation in @props.classification[2].value
      point = new AxisPoint annotation
      distances = ((chart.closestCornerDistance point) for chart in @charts)
      closest = distances.sort((a,b) -> a.distance > b.distance)[0].chart
      closest.addAxisPoint point

    # assign axis labels to charts
    for annotation in @props.classification[3].value
      label = new AxisLabel annotation
      distances = ((chart.closestMidpointDistance label) for chart in @charts)
      closest = distances.sort((a,b) -> a.distance > b.distance)[0].chart
      closest.addAxisLabel label

    for chart in @charts
      chart.buildAxes()

  parseDegrees: (str) ->
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

    isNeg = match[1] == '_'
    match.shift() if isNeg

    (parseInt(match[1],10)*15 +
      (parseInt(match[2],10)/4 || 0) +
      (parseInt(match[3])/240 || 0)) *
      if isNeg then -1 else 1

  render: ->
    #TODO: this shouldn't be necessary
    return <div/> unless @props.classification[1]

    subjImage = @props.subject.locations[0]["image/jpeg"]

    @parseClassification()

    plates = (new Plate(chart, subjImage) for chart in @charts)

    <div><ul>{
      plates.map (plate, idx) ->
        <li key={idx}>View in <a href={plate.getWwtUrl()}>World Wide Telescope</a></li>
      }
    </ul></div>
