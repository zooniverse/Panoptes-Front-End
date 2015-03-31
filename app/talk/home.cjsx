React = require 'react'
TalkInit = require './init'

module?.exports = React.createClass
  displayName: 'TalkHome'

  getSection: ->
    # Use project id for section for project talks
    # or 'zooniverse' for global-talk
    @props.project?.id ? 'zooniverse'

  render: ->
    <div className="talk-home">
      <TalkInit {...@props} section={@getSection()} />
    </div>
