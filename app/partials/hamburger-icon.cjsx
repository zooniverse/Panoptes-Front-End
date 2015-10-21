React = require 'react'

module.exports = React.createClass
  displayName: 'HamburgerIcon'

  propTypes:
    fill: React.PropTypes.string

  getDefaultProps: ->
    fill: '#ffffff'
    width: '30'
    height: '5'

  render: ->
    {fill, width, height} = @props

    <svg x="0px" y="0px" viewBox="0 0 30 30" xmlSpace="preserve">
      <g>
        <rect y="2.5" fill={fill} width={width} height={height}/>
        <rect y="12.5" fill={fill} width={width} height={height}/>
        <rect y="22.5" fill={fill} width={width} height={height}/>
      </g>
    </svg>

