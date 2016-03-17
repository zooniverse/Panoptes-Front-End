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
    imageurl: null
    hostUrl: "http://www.worldwidetelescope.org/wwtweb/ShowImage.aspx?"
    passedIn: null

  plateScale: () ->

  queryConstruct: ->
    @props.hostUrl + "name=" + @props.name + "&ra=" + @props.ra + "&dec=" + @props.dec + "&x=" + @props.x + "&y=" + @props.y + "&scale=" + @props.scale + "&rotation=" + @props.rotation + "&imageurl=" + "http://antwrp.gsfc.nasa.gov/apod/image/0811/horsehead_caelum.jpg"

  imageCrop: (url)->

  render: ->
    <div>
      <a href={@queryConstruct()}>View in WorldWide Telescope</a>
    </div>
