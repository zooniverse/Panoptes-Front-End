React = require 'react'

module.exports =
  getInitialState: ->
    currentSection = if @props.project?.id
      "project-#{@props.project.id}"
    else
      'zooniverse'

    { currentSection }
