React = require 'react'
{parseLocation, comparePaths} = require './route-helpers'

module.exports = React.createClass
  displayName: 'Link'

  getInitialState: ->
    location: parseLocation()

  handleHashChange: ->
    @setState location: parseLocation()

  componentWillMount: ->
    addEventListener 'hashchange', @handleHashChange

  componentWillUnmount: ->
    removeEventListener 'hashchange', @handleHashChange

  render: ->
    newProps =
      href: '#' + @props.href

    match = if @props.root
      decodeURI(@state.location.path) is decodeURI @props.href
    else
      decodeURI(@state.location.path).indexOf(decodeURI @props.href) is 0

    if match
      newProps['data-active'] = true

    @transferPropsTo React.DOM.a newProps, @props.children
