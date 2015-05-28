React = require 'react'
TalkInit = require './init'

module?.exports = React.createClass
  displayName: 'TalkHome'

  render: ->
    <div className="talk-home">
      <TalkInit {...@props} />
    </div>
