React = require 'react'
{parseLocation, comparePaths} = require './route-helpers'
cloneWithProps = require 'react/lib/cloneWithProps'
merge = require 'react/lib/merge'

module.exports = React.createClass
  displayName: 'Route'

  getInitialState: ->
    parseLocation()

  handleHashChange: ->
    @setState parseLocation()

  componentWillMount: ->
    addEventListener 'hashchange', @handleHashChange

  componentWillUnmount: ->
    removeEventListener 'hashchange', @handleHashChange

  render: ->
    pathComparison = comparePaths @props.path, @state.path

    if pathComparison
      routeProps =
        route:
          params: pathComparison
          query: @state.query
          hash: @state.hash

      if @props.children?
        if typeof @props.children is 'string' or @props.children instanceof Array
          @transferPropsTo React.DOM.div className: 'route', @props.children

        else # It's a component.
          @transferPropsTo cloneWithProps @props.children, merge @props.props, routeProps

      else # Look for a `handler` property.
        @transferPropsTo @props.handler routeProps

    else # If the path doesn't match, don't render!
      null
