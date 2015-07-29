React = require 'react'
MediaArea = require '../../components/media-area'

module.exports = React.createClass
  displayName: 'EditMediaPage'

  getDefaultProps: ->
    project: {}

  render: ->
    <div className="edit-media-page">
      <div className="content-container">
        <p><strong>You can add images here to use in your project’s content.</strong> Just copy and paste the image’s Markdown code: <code>![title](url)</code>.</p>
        <MediaArea resource={@props.project} />
      </div>
    </div>

  handleChange: ->
    @getMedia = null
    @forceUpdate()
