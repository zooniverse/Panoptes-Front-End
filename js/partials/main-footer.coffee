React = require 'react'

{footer} = React.DOM

module.exports = React.createClass
  displayName: 'MainFooter'

  render: ->
    footer className: 'main-footer', 'Privacy policy, contact us, etc.'
