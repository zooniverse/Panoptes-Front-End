React = require 'react'
TalkInit = require './init'

module?.exports = React.createClass
  displayName: 'TalkHome'

  getSection: ->
    # Use "#{project.id}-#{project.name}" for section for project talks
    # or "zooniverse" for global-talk

    if @props.project?.id
      "#{@props.project.id}-#{@props.project.title}"
    else
      'zooniverse'

  render: ->
    <div className="talk-home">
      <TalkInit {...@props} section={@getSection()} />
    </div>
