React = require 'react'
Feedback = require './mixins/feedback'

module?.exports = React.createClass
  displayName: 'TalkCommentReportForm'

  mixins: [Feedback]

  onSubmit: (e) ->
    e.preventDefault()
    comment = @refs.textarea.getDOMNode().value

    @refs.textarea.getDOMNode().value = ''
    @setFeedback "Comment Report successfully submitted"
    # send comment id and report to server here

  render: ->
    feedback = @renderFeedback()

    <div className="talk-comment-report-form">
      <h1>Report a comment here</h1>

      {feedback}

      <form className="talk-comment-report-form-form" onSubmit={@onSubmit}>
        <textarea ref="textarea" placeholder="Why are you reporting this comment?"></textarea>
        <button type="submit">Report</button>
      </form>
    </div>
