React = require 'react'

FILTERS = {
    invert: "url('#svg-invert-filter')"
}

INVERT =
  '<svg style="position: fixed; right: 100%; top: 100%; visibility: hidden;">
    <defs>
      <filter id="svg-invert-filter">
        <feComponentTransfer>
          <feFuncR type="table" tableValues="1 0"/>
          <feFuncG type="table" tableValues="1 0"/>
          <feFuncB type="table" tableValues="1 0"/>
        </feComponentTransfer>
      </filter>
    </defs>
  </svg>'

module.exports = React.createClass
  displayName: 'ModifiedImage'

  filterFinder: ->
    if @props.modification.invert is true
      unless document.getElementById('svg-invert-filter')
        document.body.insertAdjacentHTML('afterbegin', INVERT)
      filter: FILTERS.invert

  render: ->
    <image xlinkHref={@props.src} height={@props.height} width={@props.width} style={@filterFinder()} />
