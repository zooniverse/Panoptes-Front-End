React = require 'react'


READABLE_FORMATS =
  image: ['jpeg', 'png', 'svg+xml', 'gif']

ROOT_STYLE = display: 'block'
CONTAINER_STYLE = display: 'inline-block', position: 'relative'
SUBJECT_STYLE = display: 'block'

module.exports = React.createClass
  displayName: 'SubjectViewer'

  getDefaultProps: ->
    subject: null
    frame: 0
    # No-op:
    onFrameChange: Function.prototype
    onLoad: Function.prototype

  getReadableLocation: ->
    for mimeType, src of @props.subject.locations[@props.frame]
      [type, format] = mimeType.split '/'
      if type of READABLE_FORMATS and format in READABLE_FORMATS[type]
        break
    [type, format, src]

  render: ->
    [type, format, src] = @getReadableLocation()

    mainDisplay =switch type
      when 'image'
        <img className="subject" src={src} style={SUBJECT_STYLE} onLoad={@props.onLoad} />

    tools = switch type
      when 'image'
        for i in [0...@props.subject.locations.length]
          <button type="button" key={i} className="subject-frame-pip" data-index={i} onClick={@props.onFrameChange}>{i + 1}</button>

    <div className="subject-viewer" style={ROOT_STYLE}>
      <div className="subject-container" style={CONTAINER_STYLE}>
        {mainDisplay}
        {@props.children}
      </div>

      <div className="subject-tools">
        {tools}
      </div>
    </div>
