React = require 'react'
Feedback = require './mixins/feedback'
talkClient = require '../api/talk'

module?.exports = React.createClass
  displayName: 'TalkCommentReportForm'

  mixins: [Feedback]

  propTypes:
    comment: React.PropTypes.object

  getInitialState: ->
    error: ''
    submitted: false

  onSubmit: (e) ->
    e.preventDefault()
    comment = @refs.textarea

    moderation =
      section: @props.comment.section
      target_id: @props.comment.id
      target_type: 'Comment'
      reports: [{
        user_id: @props.comment.user_id
        message: comment.value
      }]

    talkClient.type('moderations').create(moderation).save()
      .then (moderation) =>
        @setFeedback 'Report submitted. Thank you!'
        @setState submitted: true
      .catch (e) =>
        @setState error: e.message

  render: ->
    feedback = @renderFeedback()
    {error} = @state

    <div className="talk-comment-report-form">
      {feedback}
      {if error
        <p className='submit-error'>{error}</p>}

      {unless @state.submitted
        <form className="talk-comment-report-form-form" onSubmit={@onSubmit}>
          <textarea ref="textarea" placeholder="Why are you reporting this comment?"></textarea>
          <button type="submit">Report</button>
        </form>}
    </div>
