React = require 'react'

module.exports = React.createClass
  displayName: 'HidePreviousMarksButton'

  getInitialState: ->
    hideMarks: false

  componentWillReceiveProps: ->
    console.log 'CLASSIFICATION: ', @props.classification # --STI

  toggleHideMarks: (e) ->
    console.log 'HidePreviousMarks::toggleHideMarks() >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ' # --STI
    @setState hideMarks: !@state.hideMarks, =>

      classification = @props.classification
      annotations = classification.annotations

      if @state.hideMarks
        console.log 'hiding marks before index: ', annotations[annotations.length - 1].value.length - 1
        @props.classification._hideMarksBefore = annotations[annotations.length - 1].value.length - 1
      else
        console.log 'displaying all marks'
        @props.classification._hideMarksBefore = -1

      @props.classification._hidePreviousMarks = @state.hideMarks
      @props.classification.update()
      # @props.onChange(annotations[annotations.length-1])

  render: ->
    return null unless @props.task.enableHidePrevMarks
    <button className='hide-previous-marks-button' onClick={@toggleHideMarks}>{if @state.hideMarks then 'Show' else 'Hide'} previous marks</button>
