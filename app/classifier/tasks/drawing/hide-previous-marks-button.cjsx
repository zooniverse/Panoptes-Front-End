React = require 'react'

module.exports = React.createClass
  displayName: 'HidePreviousMarksButton'

  getInitialState: ->
    hideMarks: false

  componentWillReceiveProps: ->
    console.log 'CLASSIFICATION: ', @props.classification # --STI

  toggleHideMarks: (e) ->
    @setState hideMarks: !@state.hideMarks, =>
      classification = @props.classification
      annotations = classification.annotations
      @props.classification._hidePreviousMarks = @state.hideMarks
      @props.classification._hideMarksBefore = if @state.hideMarks then annotations[annotations.length - 1].value.length - 1 else -1
      @props.classification.update()

  render: ->
    return null unless @props.task.enableHidePrevMarks
    <button className='hide-previous-marks-button' onClick={@toggleHideMarks}>{if @state.hideMarks then 'Show' else 'Hide'} previous marks</button>
