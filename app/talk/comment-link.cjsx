React = require 'react'

module?.exports = React.createClass
  displayName: 'TalkCommentLink'

  render: ->
    <div className="talk-comment-link">
      <a href="http://www.zooniverse.org/talk/comments/ex#anchor">
        http://www.zooniverse.org/talk/comments/ex\#anchor
      </a>
    </div>
