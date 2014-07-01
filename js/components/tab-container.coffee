React = window.React = require 'react'

{div} = React.DOM

Tab = React.createClass
  displayName: 'Tab'

  getInitialState: ->
    index: NaN

  render: ->
    @transferPropsTo div
      className: 'panoptes-tab'
      onClick: @props.handleClick
      if @props.selected then 'X' else @props.children

TabContainer = React.createClass
  displayName: 'TabContainer'

  getInitialState: ->
    selectedIndex: 0

  render: ->
    # tabs = React.Children.map @props.children, (child) ->
    #   child

    # contents = Array::filter.call @props.children, (child) ->
    #   child not in tabs

    div className: 'panoptes-tab-container', @props.children
      # div className: 'panoptes-tabs', tabs
      # div className: 'panoptes-tab-content', contents[@state.selectedIndex]

window.Tab = Tab
module.exports = {TabContainer, Tab}
