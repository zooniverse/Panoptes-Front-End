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
      @state.location.path is @props.href
    else
      @state.location.path.indexOf(@props.href) is 0

    if match
      newProps['data-active'] = true

    @transferPropsTo React.DOM.a newProps, @props.children
