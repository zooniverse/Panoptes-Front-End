React = require 'react'

# React.DOM doesn't include an SVG <image> tag
# (because of its namespaced `xlink:href` attribute, I think),
# so this fakes one by wrapping it in a <g>.

module.exports = React.createClass
  displayName: 'SVGImage'

  getDefaultProps: ->
    src: ''
    width: 0
    height: 0

  render: ->
    imageHTML = "<image xlink:href='#{@props.src}' width='#{@props.width}' height='#{@props.height}' />"
    <g {...@props} className="svg-image-container" dangerouslySetInnerHTML={__html: imageHTML} />

  componentDidUpdate: ->
    @fixWeirdSize()

  # This fixes weird behavior observed in Mac Safari 7
  # where the image doesn't get a size on render.
  fixWeirdSize: ->
    image = @getDOMNode().querySelector 'image'

    unless image.width is @props.width
      image.setAttribute 'width', @props.width

    unless image.height is @props.height
      image.setAttribute 'height', @props.height
