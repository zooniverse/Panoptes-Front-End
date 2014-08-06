# @cjsx React.DOM

React = require 'react'
SVGImage = require '../components/svg-image'

module.exports = React.createClass
  displayName: 'SubjectView'

  getInitialState: ->
    frame: 0

  componentWillMount: ->
    @updateSize @props.subject?.location[@state.frame]

  componentWillReceiveProps: (newProps) ->
    @updateSize newProps.subject.location[@state.frame]

  updateSize: (src) ->
    if src?
      img = document.createElement 'img'
      img.onload = =>
        if @isMounted()
          @setState
            width: img.width
            height: img.height
      img.src = src

  render: ->
    src = @props.subject?.location[@state.frame]

    <svg width={@state.width} height={@state.height}>
      <SVGImage src={src} width={@state.width} height={@state.height} />
    </svg>
