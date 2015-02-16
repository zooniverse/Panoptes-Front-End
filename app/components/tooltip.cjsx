React = require 'react'
Tether = require 'tether/tether'

DEFAULT_ATTACHMENT_POINT = 'middle center'

module.exports = React.createClass
  displayName: 'Tooltip'

  getDefaultProps: ->
    at: 'middle center'
    from: null

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
        attachment: @props.from ? DEFAULT_ATTACHMENT_POINT
        constraints: [
          {to: 'scrollParent', attachment: 'together'}
        ]
      =>
        @state.tether.position()
        @toFront()

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
