React = require 'react'
createReactClass = require 'create-react-class'

nextID = 0

module.exports = createReactClass
  displayName: 'ZooniverseLogo'

  getDefaultProps: ->
    width: '1em'
    height: '1em'
    title: 'Zooniverse Logo'

  getInitialState: ->
    nextID += 1
    titleID: 'zooniverse-logo_' + nextID

  render: ->
    className = if @props.className then @props.className else ''

    <svg role="img" className="#{className} zooniverse-logo" viewBox="0 0 100 100" width={@props.width} height={@props.height} aria-labelledby={@state.titleID} style={@props.style}>
      <title id={@state.titleID}>{@props.title}</title>
      <g fill="currentColor" stroke="none" transform="translate(50, 50)">
        <path d="M 0 -45 A 45 45 0 0 1 0 45 A 45 45 0 0 1 0 -45 Z M 0 -30 A 30 30 0 0 0 0 30 A 30 30 0 0 0 0 -30 Z"></path>
        <path d="M 0 -14 A 14 14 0 0 1 0 14 A 14 14 0 0 1 0 -14 Z"></path>
        <ellipse cx="0" cy="0" rx="6" ry="65" transform="rotate(50)"></ellipse>
      </g>
    </svg>
