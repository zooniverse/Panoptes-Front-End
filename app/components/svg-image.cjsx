React = require 'react'

# JSX doesn't support the namespaced `xlink:href` attribute,
# so we'll pass `src` instead and set it manually.

module.exports = React.createClass
  displayName: 'SVGImage'

  componentDidMount: ->
    @setHref()
    @fixWeirdSize()

  render: ->
    <image ref="image" {...@props} />

  componentDidUpdate: ->
    @setHref()
    @fixWeirdSize()

  # This fixes weird behavior observed in Mac Safari 7
  # where the image doesn't get a size on render.
  fixWeirdSize: ->
    image = @refs.image

    if @props.width? and image.width isnt @props.width
      image.setAttribute 'width', @props.width

    if @props.height? and image.height isnt @props.height
      image.setAttribute 'height', @props.height

  setHref: ->
    image = @refs.image
    image.setAttributeNS 'http://www.w3.org/1999/xlink', 'href', @props.src
