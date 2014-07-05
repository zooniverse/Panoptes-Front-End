React = require 'react'

module.exports = React.createClass
  displayName: 'Columns'

  getDefaultProps: ->
    tag: React.DOM.div

  render: ->
    tag = @props.tag
    if typeof tag is 'string'
      tag = React.DOM[tag]

    @transferPropsTo tag className: 'is-columns', @props.children
