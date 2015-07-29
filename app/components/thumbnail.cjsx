React = require 'react'

MAX_THUMBNAIL_DIMENSION = 999

module.exports = React.createClass
  displayName: 'Thumbnail'

  getDefaultProps: ->
    src: ''
    width: MAX_THUMBNAIL_DIMENSION
    height: MAX_THUMBNAIL_DIMENSION
    origin: 'https://thumbnails.zooniverse.org'

  getThumbnailSrc: ({origin, width, height, src}) ->
    srcPath = src.split('//').pop()
    "#{origin}/#{width}x#{height}/#{srcPath}"

  render: ->
    <img {...@props} src={@getThumbnailSrc @props} width={null} height={null} />
