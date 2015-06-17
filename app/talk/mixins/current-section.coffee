React = require 'react'
projectSection = require '../lib/project-section'

module.exports =
  getInitialState: ->
    currentSection = if @props.project?.id
      projectSection(@props.project)
    else
      'zooniverse'

    { currentSection }
