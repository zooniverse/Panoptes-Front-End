React = require 'react'
createReactClass = require 'create-react-class'

module.exports = createReactClass
  displayName: 'TalkFootnote'

  render: ->
    <div className="talk-footnote">
      Talk is a place for Zooniverse volunteers and researchers to discuss their projects, collect and share data, and work together to make new discoveries.
    </div>
