React = require 'react'
Tether = require 'tether/tether'

COMPLEMENTARY_ATTACHMENTS =
  'middle left': 'middle right'
  'middle right': 'middle left'

module.exports = React.createClass
  displayName: 'Tooltip'

  getDefaultProps: ->
    at: 'middle center'
    from: null
    offset: '8px'

  getInitialState: ->
    container = document.createElement 'div'
    container.classList.add 'tooltip-container'
    document.body.appendChild container

    container: container
    tether: null

  componentDidMount: ->
    @renderTooltip()

    @setState
      tether: new Tether
        target: @getDOMNode().parentNode
        targetAttachment: @props.at
        element: @state.container
        attachment: @props.from ? COMPLEMENTARY_ATTACHMENTS[@props.at]
        targetOffset: "#{@props.offset} #{@props.offset}"
        constraints: [
          {to: 'scrollParent', attachment: 'together'}
        ]
      =>
        @state.tether.position()

  componentWillUnmount: ->
    React.unmountComponentAtNode @state.container
    @state.container.parentNode.removeChild @state.container
    @state.tether.destroy()

  componentDidUpdate: (prevProps, prevState) ->
    @renderTooltip()

  render: ->
    <noscript className="tooltip-anchor"></noscript>

  renderTooltip: ->
    React.render <div className="tooltip" onClick={@toFront}>
      <div className="arrow"></div>
      <div className="content">
        {@props.children}
      </div>
    </div>, @state.container

  toFront: ->
    if @state.container.nextSibling?
      @state.container.parentNode.appendChild @state.container
