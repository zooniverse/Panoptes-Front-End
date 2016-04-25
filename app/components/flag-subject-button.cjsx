React = require 'react'

module?.exports = React.createClass
  displayName: 'FlagSubjectButton'

  propTypes:
    # not sure if we'll need all these
    subject: React.PropTypes.object # a subject response from panoptes
    project: React.PropTypes.object # a project response from panoptes
    workflow: React.PropTypes.object
    classification: React.PropTypes.object
    user: React.PropTypes.object

  toggleFlag: ->
    return if @props.classification.completed

    # save flag in metadata (Note: consider storing as classification.subject_flagged instead)
    changes = {}
    changes["metadata.subject_flagged"] = !@props.classification.metadata.subject_flagged
    @props.classification.update changes

  render: ->
    subject_flagged = @props.classification.metadata.subject_flagged
    <button
      className="flag-subject-button"
      type="button"
      title="#{if subject_flagged then 'Unflag' else 'Flag'} Subject as Inappropriate"
      onClick={@toggleFlag}>
      <i className="#{if subject_flagged then 'fa fa-flag' else 'fa fa-flag-o'}" />
    </button>
