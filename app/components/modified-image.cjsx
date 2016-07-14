React = require 'react'

STYLE = {
    filter: "url('#svg-invert-filter')"
}

MARKUP =
  '<svg id="svg-invert-filter" style="position: fixed; right: 100%; top: 100%; visibility: hidden;">
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

  componentWillMount: ->
    @setElements()

  setElements: ->
    filter = document.getElementById('svg-invert-filter')
    unless filter
      document.body.insertAdjacentHTML('afterbegin', MARKUP)

  render: ->
    <image xlinkHref={@props.src} {...@props} style={STYLE if @props?.subject} />
