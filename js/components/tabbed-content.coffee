React = window.React = require 'react'

{div} = React.DOM

TabbedContent = React.createClass
  displayName: 'TabbedContent'

  render: ->
    @transferPropsTo div className: 'tabbed-content', @props.children

TabbedContent.Tab = React.createClass
  displayName: 'TabbedContentTab'

  render: ->
    @transferPropsTo div className: 'tabbed-content-tab', @props.children

TabbedContent.Tabs = React.createClass
  displayName: 'TabbedContentTabs'

  render: ->
    @transferPropsTo div className: 'tabbed-content-tabs', @props.children

TabbedContent.Content = React.createClass
  displayName: 'TabbedContentContent'

  render: ->
    @transferPropsTo div className: 'tabbed-content-content', @props.children

module.exports = TabbedContent
