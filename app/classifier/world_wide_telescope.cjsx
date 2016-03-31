React = require 'react'
apiClient = require 'panoptes-client/lib/api-client'

module.exports = React.createClass
  getDefaultProps: ->
    name: "Horsehead"
    ra: null
    x: null
    dec: null
    y: null
    scale: null
    rotation: null
    charts: []
    hostUrl: "http://www.worldwidetelescope.org/wwtweb/ShowImage.aspx?"

  plateScale: (item1, item2) -> # this will only convert with DEC and RA
    averageDec = (item1.dec + item2.dec) / 2
    deltaRA = ((item2.ra - item1.ra) * Math.cos(averageDec * Math.PI/180)) * 3600
    deltaDec = (item2.dec - item1.dec) * 3600
    angularSep = Math.sqrt(Math.pow(deltaRA,2) + Math.pow(deltaDec,2))
    pixelSep = Math.sqrt(Math.pow(item1.x - item2.x,2) + (Math.pow(item1.y-item2.y, 2)))
    @props.scale = angularSep / pixelSep

  equatConvert: (lat, lon) -> #convert galactic to equatorial coordinates in order to convert platescale
    l = @radians(lat)
    b = @radians(lon)
    pole_ra = @radians(192.859508)
    pole_dec = @radians(27.128336)
    posangle = @radians(122.932-90.0)
    ra = Math.atan2((Math.cos(b)*Math.cos(l-posangle)), (Math.sin(b)*Math.cos(pole_dec) - Math.cos(b)*Math.sin(pole_dec)*Math.sin(l-posangle))) + pole_ra
    dec = Math.asin(Math.cos(b)*Math.cos(pole_dec)*Math.sin(l-posangle)+Math.sin(b)*Math.sin(pole_dec))
    [@degrees(ra), @degrees(dec)]

  radians: (degrees) ->
    degrees * Math.PI / 180

  degrees: (radians) ->
    radians * 180 / Math.PI

  queryConstruct: () ->
    # If above doesn't work, write a promise, which includes a then statement. Make a get and a then
    @props.hostUrl + "name=" + @props.name + "&ra=" + @props.ra + "&dec=" + @props.dec + "&x=" + @props.x + "&y=" + @props.y + "&scale=" + @props.scale + "&rotation=" + @props.rotation + "&imageurl=" + @imageCrop()

  collectCharts: -> # organizes annotations into easier to read array of charts
    units = @props.classification[3].value
    for chart in @props.classification[1].value # get corner units for charts
      graph = {
        corners: [[chart.x, chart.y],
        [chart.x + chart.width, chart.y],
        [chart.x, chart.y + chart.height],
        [chart.x + chart.width, chart.y + chart.height]],
        values: []
      }
      @props.charts.push(graph)
    for range in @props.classification[2].value # match axis to respective charts
      least = Infinity
      index = 0
      @props.charts.forEach (chart, i) ->
        chart.corners.map (point) ->
          distance = Math.sqrt((range.x-point[0])*(range.x-point[0]) + (range.y-point[1])*(range.y-point[1]))
          if distance < least
            least = distance
            index = i
      @props.charts[index].values.push({x: range.x, y: range.y, num: range.details[0].value})
    for chart in @props.charts # match units to respective axis
      for value in chart.values
        least = Infinity
        chart.values.map (value1) ->
          midpoint = {x:(value.x + value1.x)/2, y:(value.y + value1.y)/2}
          units.map (unit) ->
            distance = Math.sqrt((midpoint.x-unit.x)*(midpoint.x-unit.x) + (midpoint.y-unit.y)*(midpoint.y-unit.y))
            if distance < least
              least = distance
              value.unit = unit.details[0].value
    # @props.classification[2].value.filter (axis) ->
    #   if /[:hms]/.test(axis.details[0].value) # Check if RA is in sexagesimal
    #     @degreeConvert axis.details[0].value

  degreeConvert: (item) -> # This will convert RA from sexagesimal to degrees
    degrees = 0
    split = item.match(/[0-9]+/g)
    degrees += split[0]*15
    degrees += split[1]/4 if split[1]
    degrees += split[2]/240 if split[2]

  imageCrop: ->
    @props.subject.locations[0]["image/jpeg"]
    annotation = @props.classification.filter (classify) ->
      classify.task == 'draw'
    crop = annotation[0]?.value[1]
    "http://imgproc.zooniverse.org/crop?w=" + crop?.width + "&h=" + crop?.height + "&x=" + crop?.x + "&y=" + crop?.y + "&u=" + "panoptes-uploads.zooniverse.org/production/subject_location/90a3b642-55e2-4583-a4fb-2f0abeb5b285.jpeg"

  render: ->
    @collectCharts() if @props.classification[1]
    <div>
      <a href={@queryConstruct()}>View in WorldWide Telescope</a>
    </div>
