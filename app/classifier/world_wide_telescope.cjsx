React = require 'react'
apiClient = require 'panoptes-client/lib/api-client'

module.exports = React.createClass
  getDefaultProps: ->
    name: "Horsehead"
    ra: 85.2983
    x: 450
    dec: -2.42589
    y: 300
    scale: 1.69
    rotation: 90.21
    hostUrl: "http://www.worldwidetelescope.org/wwtweb/ShowImage.aspx?"

  plateScale: (item1, item2) ->
    averageDec = (item1.dec + item2.dec) / 2
    deltaRA = ((item2.ra - item1.ra) * Math.cos(averageDec * Math.PI/180)) * 3600
    deltaDec = (item2.dec - item1.dec) * 3600
    angularSep = Math.sqrt(Math.pow(deltaRA,2) + Math.pow(deltaDec,2))
    pixelSep = Math.sqrt(Math.pow(item1.x - item2.x,2) + (Math.pow(item1.y-item2.y, 2)))
    @props.scale = angularSep / pixelSep

  queryConstruct: ->
    @props.hostUrl + "name=" + @props.name + "&ra=" + @props.ra + "&dec=" + @props.dec + "&x=" + @props.x + "&y=" + @props.y + "&scale=" + @props.scale + "&rotation=" + @props.rotation + "&imageurl=" + @imageCrop()

  imageCrop: ->
    console.log @props.subjImage.locations[0]["image/jpeg"]
    console.log @props.subjCrop.value
    // "imgproc.zooniverse.org/crop?w=" + width + "&h=" + height + "&x=" + x + "&y=" + y + "&u=" + url

  render: ->
    <div>
      <a href={@queryConstruct()}>View in WorldWide Telescope</a>
    </div>
