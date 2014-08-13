# @cjsx React.DOM

React = require 'react'
SVGImage = require '../components/svg-image'
LoadingIndicator = require '../components/loading-indicator'

module.exports = React.createClass
  displayName: 'SubjectView'

  getInitialState: ->
    frame: 0
    width: 0
    height: 0

  componentWillMount: ->
    @componentWillReceiveProps @props

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.subject is @props?.subject
      setTimeout =>
        @setFrame 0

  setFrame: (frame) ->
    @setState {frame}

    img = document.createElement 'img'
    img.onload = =>
      if @isMounted()
        @setState
          width: img.width
          height: img.height

    img.src = @props.subject.location[frame]

  render: ->
    if @props?.subject?
      <svg viewBox="0 0 #{@state?.width ? 0} #{@state?.height ? 0}">
        <SVGImage src={@props.subject.location[@state.frame]} width={@state.width} height={@state.height} />
      </svg>

    else
      <p>Loading subject viewer <LoadingIndicator /></p>
