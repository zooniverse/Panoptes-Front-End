React = require('react')
{Link} = require 'react-router'

FlexibleLink = React.createClass
  displayName: 'FlexibleLink'

  propTypes:
    to: React.PropTypes.string.isRequired
    skipOwner: React.PropTypes.bool

  isExternal: ->
    @props.to.indexOf('http') > -1

  render: ->
    if @isExternal()
      <a href={@props.to}>{@props.children}</a>
    else
      <Link {...@props}>{@props.children}</Link>

module.exports = FlexibleLink