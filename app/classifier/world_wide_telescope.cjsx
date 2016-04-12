React = require 'react'
ReactDOM = require 'react-dom'

module.exports = React.createClass
  displayName: 'WorldWideTelescope'

  getDefaultProps: ->
    charts: []
    urls: []
    wwtUrl: "http://www.worldwidetelescope.org/wwtweb/ShowImage.aspx?"

  plateScale: (item1, item2) ->
    averageDec = (item1.dec + item2.dec) / 2
    deltaRA = ((item2.ra - item1.ra) * Math.cos(averageDec * Math.PI/180)) * 3600
    deltaDec = (item2.dec - item1.dec) * 3600
    angularSep = Math.sqrt(Math.pow(deltaRA,2) + Math.pow(deltaDec,2))
    pixelSep = Math.sqrt(Math.pow(item1.x - item2.x,2) + (Math.pow(item1.y-item2.y, 2)))
    angularSep / pixelSep

  equatConvert: (object) -> #convert galactic to equatorial coordinates
    l = @radians object.ra
    b = @radians object.dec
    pole_ra = @radians 192.859508
    pole_dec = @radians 27.128336
    posangle = @radians 122.932-90.0
    object.ra = @degrees(Math.atan2((Math.cos(b)*Math.cos(l-posangle)), (Math.sin(b)*Math.cos(pole_dec) - Math.cos(b)*Math.sin(pole_dec)*Math.sin(l-posangle))) + pole_ra)
    object.dec = @degrees(Math.asin(Math.cos(b)*Math.cos(pole_dec)*Math.sin(l-posangle)+Math.sin(b)*Math.sin(pole_dec)))
    object

  radians: (degrees) ->
    degrees * Math.PI / 180

  degrees: (radians) ->
    radians * 180 / Math.PI

  queryConstruct: (chart) ->
    query = {lon: [], lat: []}
    ra = 0
    dec = 0
    for value in chart.values
      value.num = @degreeConvert value if value.unit is 0 or 1
      query.lon.push(value) if value.unit is 3 or value.unit is 0
      query.lat.push(value) if value.unit is 2 or value.unit is 1
    oppositeEnds = @oppositeCorners query, chart.xBounds, chart.yBounds
    for points in oppositeEnds
      points = @equatConvert points if points.galactic is true
      ra += points.ra
      dec += points.dec
    scale = @plateScale oppositeEnds[0], oppositeEnds[1]
    ra = ra / 2
    dec = dec / 2
    x = (chart.xBounds[1] - chart.xBounds[0]) / 2
    y = (chart.yBounds[1] - chart.yBounds[0]) / 2
    rotation = @rotationAngle(chart, query)
    name = "Horsehead" # Must create unique names
    @props.urls.push({id: @props.urls.length, link: @props.wwtUrl + "name=" + name + "&ra=" + ra + "&dec=" + dec + "&x=" + x + "&y=" + y + "&scale=" + scale + "&rotation=" + rotation + "&imageurl=" + @imageCrop(chart)})

  rotationAngle: (chart, query) ->
    yAxis = false
    query.lon.map (ra) ->
      yAxis = true if ra.y > chart.yBounds[0] and ra.y < chart.yBounds[1]
    if yAxis then 0 else 90

  oppositeCorners: (query, xBounds, yBounds) ->
    galactic = false
    closeDist = 0
    farDist = Infinity
    furthest = {}
    closest = {}
    for lat in query.lat
      for lon in query.lon
        separation = Math.sqrt(Math.pow(lat.x-lon.x,2) + Math.pow(lat.y-lon.y,2))
        if separation > closeDist
          galactic = true if lat.unit is 2 and lon.unit is 3
          closeDist = separation
          furthest = {dec: Number(lat.num), ra: Number(lon.num), galactic: galactic, x: @inBounds([lat.x, lon.x] ,xBounds), y: @inBounds([lat.y, lon.y], yBounds)}
        if separation < farDist
          galactic = true if lat.unit is 2 and lon.unit is 3
          farDist = separation
          closest = {dec: Number(lat.num), ra: Number(lon.num), galactic: galactic, x: @inBounds([lat.x, lon.x], xBounds), y: @inBounds([lat.y, lon.y], yBounds)}
    [furthest, closest]

  inBounds: (test, boundaries) ->
    answer = 0
    test.map (value) ->
      answer = value if value > boundaries[0] and value < boundaries[1]
    answer

  collectCharts: -> # organizes annotations into easier to read array of charts
    units = @props.classification[3].value
    for chart in @props.classification[1].value # get corner units for charts
      graph = {
        corners: [{x: chart.x, y: chart.y}, {x: chart.x + chart.width, y: chart.y},
        {x: chart.x, y: chart.y + chart.height},{x: chart.x + chart.width, y: chart.y + chart.height}]
        values: []
        x: chart.x
        y: chart.y
        width: chart.width
        height: chart.height
        xBounds: [chart.x, chart.x + chart.width]
        yBounds: [chart.y, chart.y + chart.height]
      }
      @props.charts.push(graph)
    for value in @props.classification[2].value # match axis values to respective charts
      least = Infinity
      index = 0
      @props.charts.forEach (chart, i) ->
        chart.corners.map (point) ->
          distance = Math.sqrt(Math.pow(value.x-point.x, 2) + Math.pow(value.y-point.y, 2))
          if distance < least
            least = distance
            index = i
      @props.charts[index].values.push({x: value.x, y: value.y, num: value.details[0].value})
    for chart in @props.charts # match units to respective axis
      for value in chart.values
        least = Infinity
        chart.values.map (value1) ->
          midpoint = {x:(value.x + value1.x)/2, y:(value.y + value1.y)/2}
          units.map (unit) ->
            distance = Math.sqrt(Math.pow(midpoint.x-unit.x, 2) + Math.pow(midpoint.y-unit.y, 2))
            if distance < least
              least = distance
              value.unit = unit.details[0].value

  degreeConvert: (item) -> # This will convert RA and DEC to degrees
    degrees = item.num
    if /[:hms\s]/.test(item.num) and item.unit is 0
      degrees = 0
      split = item.num.match /[0-9]+/g
      degrees += Number(split[0]*15)
      degrees += Number(split[1]/4) if split[1]
      degrees += Number(split[2]/240) if split[2]
    if /[:'dms\s]/.test(item.num) and item.unit is 1
      degrees = 0
      split = item.num.match /[-]+|[0-9]+/g
      negative = split.shift() if split[0] is "-"
      degrees += Number(split[0])
      degrees += Number(split[1]/60) if split[1]
      degrees = negative + degrees if negative
    degrees

  imageCrop: (chart) ->
    subjImage = @props.subject.locations[0]["image/jpeg"]
    "http://imgproc.zooniverse.org/crop?w=" + chart.width + "&h=" + chart.height + "&x=" + chart.x + "&y=" + chart.y + "&u=" + "panoptes-uploads.zooniverse.org/production/subject_location/90a3b642-55e2-4583-a4fb-2f0abeb5b285.jpeg"

  render: ->
    @collectCharts() if @props.classification[1]
    for chart in @props.charts
      @queryConstruct chart
    <div>
    <p>View Your Classification(s) through the WorldWide Telescope!</p>
    {@props.urls.map (url) ->
        <div className="telescope-item"><a key={url.id} className="standard-button" href={url.link}>Chart {url.id + 1}</a></div>
        }
    </div>
