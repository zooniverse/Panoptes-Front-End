React = require 'react'
MainHeader = require './main-header'
MainFooter = require './main-footer'

{div} = React.DOM

module.exports = React.createClass
  displayName: 'App'

  render: ->
    div className: 'main-app',
      MainHeader null
      div className: 'main-content',
        @props.activeRoute
      MainFooter null
