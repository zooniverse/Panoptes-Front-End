React = require 'react'
ReactDOM = require 'react-dom'
Tether = require 'tether/tether' if window.document

DEFAULT_ATTACHMENT_POINT = 'middle center'

module.exports = React.createClass
  displayName: 'Tooltip'

  getDefaultProps: ->
    attachment: 'middle center'
    targetAttachment: 'middle center'
    offset: '0 0'
    targetOffset: '0 0'
    pin: false
    arrowStyle: null

  getInitialState: ->
    container = document.createElement 'div'
    container.classList.add 'tooltip-container'
    document.body.appendChild container

    container: container
    tether: null

  componentDidMount: ->
    @renderTooltip()

    if Tether?
      @setState
        tether: new Tether @getTetherOptions()
        =>
          @state.tether.position()
          @toFront()

  componentWillUnmount: ->
    ReactDOM.unmountComponentAtNode @state.container
    @state.container.parentNode.removeChild @state.container
    @state.tether?.destroy()

  componentDidUpdate: ->
    @renderTooltip()
    @state.tether?.setOptions @getTetherOptions()
    @state.tether?.position()

  getTetherOptions: ->
    element: @state.container
    target: ReactDOM.findDOMNode(@).parentNode
    attachment: @props.attachment
    targetAttachment: @props.targetAttachment
    offset: @props.offset
    targetOffset: @props.targetOffset
    constraints: [
      {to: 'window', pin: @props.pin}
    ]

  render: ->
    <noscript className="tooltip-anchor"></noscript>

  renderTooltip: ->
    ReactDOM.render <div className="tooltip" onClick={@toFront}>
      <div className="arrow" style={@props.arrowStyle}></div>
      <div className="content">
        {@props.children}
      </div>
    </div>, @state.container

  toFront: ->
    if @state.container.nextSibling?
      @state.container.parentNode.appendChild @state.container
