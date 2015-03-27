React = require 'react'
LoadingIndicator = require '../components/loading-indicator'
alert = require '../lib/alert'
getSubjectLocation = require '../lib/get-subject-location'

NOOP = Function.prototype

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
    onFrameChange: NOOP
    onLoad: NOOP

  getInitialState: ->
    loading: true

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.subject is @props.subject and nextProps.frame is @props.frame
      @setState loading: true

  render: ->
    {type, format, src} = getSubjectLocation @props.subject, @props.frame

    mainDisplay = switch type
      when 'image'
        <img className="subject" src={src} style={SUBJECT_STYLE} onLoad={@handleImageLoad} />

    tools = switch type
      when 'image'
        if @props.subject?.locations.length < 2
          null
        else
          <span className="subject-frame-pips">
            {for i in [0...@props.subject?.locations.length ? 0]
              <button type="button" key={i} className="subject-frame-pip #{if i is @props.frame then 'active' else ''}" value={i} onClick={@props.onFrameChange}>{i + 1}</button>}
          </span>

    <div className="subject-viewer" style={ROOT_STYLE}>
      <div className="subject-container" style={CONTAINER_STYLE}>
        {mainDisplay}
        {@props.children}
        {if @state.loading
          <div className="loading-cover" style={@constructor.overlayStyle}>
            <LoadingIndicator />
          </div>}
      </div>

      <div className="subject-tools">
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

  handleImageLoad: (e) ->
    @setState loading: false
    @props.onLoad? arguments...
