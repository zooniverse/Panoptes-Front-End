React = require 'react'
Tether = require 'tether/tether'

COMPLEMENTARY_ATTACHMENTS =
  'middle left': 'middle right'
  'middle right': 'middle left'

TooltipFloater = React.createClass
  displayName: 'TooltipFloater'

  render: ->
    <div className="tooltip">
      <div className="arrow"></div>
      <div className="content">
        {@props.children}
      </div>
    </div>

module.exports = React.createClass
  displayName: 'TooltipAnchor'

  getDefaultProps: ->
    at: 'middle center'
    from: null
    offset: '10px 10px'

  getInitialState: ->
    container = document.createElement 'div'
    container.classList.add 'tooltip-container'
    document.body.appendChild container

    container: container
    tooltip: null
    tether: null

  componentDidMount: ->
    tooltip = React.render <TooltipFloater>
      {@props.children}
    </TooltipFloater>, @state.container

    @setState
      tooltip: tooltip
      tether: new Tether
        target: @getDOMNode().parentNode
        targetAttachment: @props.at
        element: @state.container
        attachment: @props.from ? COMPLEMENTARY_ATTACHMENTS[@props.at]
        targetOffset: @props.offset
        constraints: [
          {to: 'scrollParent', attachment: 'together'}
        ]
      =>
        @state.tether.position()

  componentWillUnmount: ->
    React.unmountComponentAtNode @state.container
    @state.container.parentNode.removeChild @state.container
    @state.tether.destroy()

  render: ->
    <noscript className="tooltip-anchor"></noscript>
