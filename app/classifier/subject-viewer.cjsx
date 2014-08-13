# @cjsx React.DOM

React = require 'react'
subjectsStore = require '../data/subjects'
SVGImage = require '../components/svg-image'
LoadingIndicator = require '../components/loading-indicator'

module.exports = React.createClass
  displayName: 'SubjectView'

  getInitialState: ->
    subject: null
    frame: 0
    width: 0
    height: 0

  componentWillMount: ->
    @loadSubject @props.subject

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.subject is @state.subject?.id
      @loadSubject nextProps.subject

  loadSubject: (id) ->
    subjectsStore.get(id).then (subject) =>
      @setState {subject}
      @setFrame 0

  setFrame: (frame) ->
    @setState {frame}

    img = document.createElement 'img'
    img.onload = =>
      if @isMounted()
        @setState
          width: img.width
          height: img.height

    img.src = @state.subject.location[frame]

  render: ->
    if @state.subject?
      <svg viewBox="0 0 #{@state.width ? 0} #{@state.height ? 0}">
        <SVGImage src={@state.subject.location[@state.frame]} width={@state.width} height={@state.height} />
      </svg>

    else
      <p>Loading subject viewer</p>
