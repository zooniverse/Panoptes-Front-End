React = require 'react'

module.exports = React.createClass
  displayName: 'HidePreviousMarksButton'

  getInitialState: ->
    hidden: false

  componentWillReceiveProps: ->
    # console.log 'HidePreviousMarks::componentWillReceiveProps(), props = ', @props.classification # --STI

  toggleHideMarks: (e) ->
    console.log 'HidePreviousMarks::toggleHideMarks() >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ' # --STI
    @setState hidden: !@state.hidden, =>

      classification = @props.classification
      annotations = classification.annotations

      if @state.hidden
        console.log 'hiding marks before index: ', annotations[annotations.length - 1].value.length - 1
        @props.classification._hideMarksBefore = annotations[annotations.length - 1].value.length - 1
      else
        console.log 'displaying all marks'
        @props.classification._hideMarksBefore = -1

      @props.classification.update()
      @props.onChange(annotations[annotations.length-1])

      # console.log 'CLASSIFICATION: ', @props.classification._hideMarksBefore # --STI

      # annotations = @props.classification.annotations
      # annotation = annotations[annotations.length - 1]
      # annotation.hidePreviousMarks = @state.hidden
      # annotation.hideMarksBeforeIndex = if @state.hidden then annotation.value.length else -1
      # @props.onChange(annotation)

      # for annotation, i in @props.classification.annotations
      #   console.log 'ANNOTATION[',i,']: ', annotation # --STI
      #   annotation.hidePreviousMarks = @state.hidden
      #   annotation.hideMarksBeforeIndex = if @state.hidden then annotation.value.length else -1
      #   @props.onChange(annotation)

  render: ->
    # console.log 'HIDE MARKS? ', @state.hidden # --STI
    return null unless @props.task.enableHidePrevMarks
    <button className='hide-previous-marks-button' onClick={@toggleHideMarks}>{if @state.hidden then 'Show' else 'Hide'} previous marks</button>
