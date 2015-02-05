React = require 'react'
alert = require '../lib/alert'

READABLE_FORMATS =
  image: ['jpeg', 'png', 'svg+xml', 'gif']

ROOT_STYLE = display: 'block'
CONTAINER_STYLE = display: 'inline-block', position: 'relative'
SUBJECT_STYLE = display: 'block'

module.exports = React.createClass
  displayName: 'SubjectViewer'

  statics:
    overlayStyle:
      height: '100%'
      left: 0
      position: 'absolute'
      top: 0
      width: '100%'

  getDefaultProps: ->
    subject: null
    frame: 0
    # No-op:
    onFrameChange: Function.prototype
    onLoad: Function.prototype

  getReadableLocation: ->
    for mimeType, src of @props.subject?.locations?[@props.frame] ? {}
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
        if @props.subject?.locations.length < 2
          null
        else
          <span className="subject-frame-pips">
            {for i in [0...@props.subject?.locations.length ? 0]
              <button type="button" key={i} className="subject-frame-pip #{if i is @props.frame then 'active' else ''}" data-index={i} onClick={@props.onFrameChange}>{i + 1}</button>}
          </span>

    <div className="subject-viewer" style={ROOT_STYLE}>
      <div className="subject-container" style={CONTAINER_STYLE}>
        {mainDisplay}
        {@props.children}
      </div>

      <div className="subject-tools">
        <span></span>
        <span>{tools}</span>
        <span>
          {if @props.subject?.metadata?
            <button type="button" className="metadata-toggle" onClick={@showMetadata}><i className="fa fa-table fa-fw"></i></button>}
        </span>
      </div>
    </div>

  showMetadata: ->
    # TODO: Sticky popup.
    alert <div className="content-container">
      Subject metadata<br />
      <table>
        {for key, value of @props.subject?.metadata
          <tr key={key}>
            <th>{key}</th>
            <td><code><pre>{JSON.stringify value, null, 2}</pre></code></td>
          </tr>}
      </table>
    </div>
