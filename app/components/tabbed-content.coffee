React = window.React = require 'react'

{div, a} = React.DOM

Tab = React.createClass
  displayName: 'TabbedContentTab'

  getDefaultProps: ->
    selected: false

  render: ->
    type = div
    if 'href' of @props
      type = a

    @transferPropsTo type
      className: "tabbed-content-tab #{if @props.selected then 'selected-tab' else ''}"
      @props.children

TabbedContent = React.createClass
  displayName: 'TabbedContent'

  getInitialState: ->
    selectedIndex: 0

  getDefaultProps: ->
    side: 'top'

  setIndex: (index) ->
    @setState selectedIndex: index

  render: ->
    tabIndex = -1
    tabChildren = React.Children.map @props.children, (child) =>
      if child.type.ConvenienceConstructor is Tab
        tabIndex += 1
        child.props.onClick = @setIndex.bind this, tabIndex
        child.props.selected = tabIndex is @state.selectedIndex
        child

    contentsCount = 0
    React.Children.map @props.children, (child) =>
      unless child.type.ConvenienceConstructor is Tab
        contentsCount += 1

    selectedContentIndex = @state.selectedIndex %% contentsCount

    contentIndex = -1
    activeContent = React.Children.map @props.children, (child) =>
      unless child.type.ConvenienceConstructor is Tab
        contentIndex += 1
        if contentIndex is selectedContentIndex
          child

    @transferPropsTo div className: 'tabbed-content', 'data-side': @props.side,
      div className: 'tabbed-content-tabs',
      tabChildren
      activeContent

TabbedContent.Tab = Tab

module.exports = TabbedContent
