React = require 'react'

IMAGE_EXTENSIONS = ['gif', 'jpeg', 'jpg', 'png', 'svg']

VIDEO_EXTENSIONS = ['mp4']

module.exports = React.createClass
  getDefaultProps: ->
    src: ''

  render: ->
    srcExtension = @props.src.split('.').pop().toLowerCase()

    <div {...@props} className={"media-card #{@props.className}".trim()}>
      {if @props.src
        <div className="media-card-header">
          {if srcExtension in IMAGE_EXTENSIONS
            <img className="media-card-media" src={@props.src} />
          else if srcExtension in VIDEO_EXTENSIONS
            <video className="media-card-media" src={@props.src}>
              <p>Your browser does not support this video format.</p>
            </video>
          else
            console.warn "Not sure how to render #{@props.src}"
            null}
        </div>}

      {if @props.children
        <div className="media-card-content">{@props.children}</div>}
    </div>
