React = require 'react'

IMAGE_EXTENSIONS = ['gif', 'jpg', 'png', 'svg']

VIDEO_EXTENSIONS = ['mp4']

module.exports = React.createClass
  getDefaultProps: ->
    media: ''

  render: ->
    mediaExtension = @props.media.split('.').pop().toLowerCase()

    <div className="media-card" {...@props}>
      {if @props.media
        <div className="media-card-header">
          {if mediaExtension in IMAGE_EXTENSIONS
            <img className="media-card-media" src={@props.media} />
          else if mediaExtension in VIDEO_EXTENSIONS
            <video className="media-card-media" src={@props.media}>
              <p>Your browser does not support this video format.</p>
            </video>
          else
            console.warn "Not sure how to render media #{@props.media}"
            null}
        </div>}

      {if @props.children
        <div className="media-card-content">{@props.children}</div>}
    </div>
