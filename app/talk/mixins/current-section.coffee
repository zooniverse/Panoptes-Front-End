React = require 'react'

module.exports =
  getInitialState: ->
    currentSection = if @props.project?.id
      "#{@props.project.id}-#{@props.project.title}"
    else
      'zooniverse'

    { currentSection }
