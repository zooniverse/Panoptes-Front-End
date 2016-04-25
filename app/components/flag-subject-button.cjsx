React = require 'react'

module?.exports = React.createClass
  displayName: 'FlagSubjectButton'

  toggleFlag: ->
    return if @props.classification.completed
    subject_flagged = @props.classification.metadata.subject_flagged

    # save flag in metadata (note: consider storing as classification.subject_flagged instead)
    changes = {}
    if subject_flagged
      changes["metadata.subject_flagged"] = !subject_flagged
    else
      subject_flagged = window.prompt 'What is your reason for flagging this subject?'
      return if subject_flagged is null
      changes["metadata.subject_flagged"] = subject_flagged

    console.log 'SUBJECT FLAGGED = ', subject_flagged

    @props.classification.update changes

  render: ->
    subject_flagged = @props.classification.metadata.subject_flagged
    <button
      disabled={@props.classification.completed}
      className="flag-subject-button"
      type="button"
      title="#{if subject_flagged then 'Unflag' else 'Flag'} Subject as Inappropriate"
      onClick={@toggleFlag}>
      <i className="#{if subject_flagged then 'fa fa-flag' else 'fa fa-flag-o'}" />
    </button>
