React = require 'react'

{div, h1, p} = React.DOM

module.exports = React.createClass
  displayName: 'ProjectsPage'

  render: ->
    div className: 'projects-page',
      h1 null, 'Projects'
      p null, 'This is the projects page.'
