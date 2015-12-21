React = require 'react'
MediaArea = require '../../components/media-area'

VALID_SUBJECT_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.svg']

module.exports = React.createClass
  displayName: 'EditMediaPage'

  getDefaultProps: ->
    project: {}

  render: ->
    <div className="edit-media-page">
      <div className="content-container">
        <p><strong>You can add images here to use in your project’s content.</strong>  Just copy and paste the image’s Markdown code: <code>![title](url)</code>. Images can be any of: {<span key={ext}><code>{ext}</code>{', ' if VALID_SUBJECT_EXTENSIONS[i + 1]?}</span> for ext, i in VALID_SUBJECT_EXTENSIONS}{' '} </p>
        <MediaArea resource={@props.project} />
      </div>
    </div>

  handleChange: ->
    @getMedia = null
    @forceUpdate()
