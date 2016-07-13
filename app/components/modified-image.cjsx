React = require 'react'

STYLE = {
    filter: "url('#svg-invert-filter')"
}

MARKUP =
  '<svg style=\"position: fixed; right: 100%; top: 100%; visibility: hidden;\">
    <defs>
      <filter id=\"svg-invert-filter\">
        <feColorMatrix in=\"SourceGraphic\" type=\"matrix\" values=\"
              -1  0  0 0 1
               0 -1  0 0 1
               0  0 -1 0 1
               0  0  0 1 0
             \" />
      </filter>
    </defs>
  </svg>'

module.exports = React.createClass
  displayName: 'ModifiedImage'

  componentWillMount: ->
    @setElements()

  setElements: ->
    document.body.insertAdjacentHTML('afterbegin', MARKUP)

  render: ->
    <image xlinkHref={@props.src} {...@props} style={STYLE} />
