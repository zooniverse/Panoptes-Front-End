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

  getInitialState: ->
    flagged: false

  toggleFlag: ->
    # console.log 'toggleFlag()'
    @setState flagged: !@state.flagged, =>
      @props.classification.annotations['flagged_subject'] = @state.flagged
      @props.classification.update 'annotations'
      console.log "ANNOTATIONS: ", @props.classification.annotations

  # componentWillReceiveProps: (new_props) ->
  #   console.log 'CLASSIFICATION: ', new_props.classification

  render: ->
    <button
      className="flag-subject-button"
      type="button"
      title="#{if @state.flagged then 'Unflag' else 'Flag'} Subject as Inappropriate"
      onClick={@toggleFlag}>
      <i className="fa fa-exclamation#{if @state.flagged then '-circle' else ''}" />
    </button>
