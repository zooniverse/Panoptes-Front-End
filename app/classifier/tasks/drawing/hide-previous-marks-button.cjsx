React = require 'react'

module.exports = React.createClass
  displayName: 'HidePreviousMarksButton'

  getInitialState: ->
    hideMarks: false
    currentAnnotation: @getCurrentAnnotation()

  componentWillReceiveProps: ->
    currentAnnotation = @getCurrentAnnotation()
    if currentAnnotation isnt @state.currentAnnotation # task must have changed
      @setState currentAnnotation: currentAnnotation,
        => if @state.hideMarks then @toggleHideMarks() # reset hidden marks

  getCurrentAnnotation: ->
    classification = @props.classification
    annotations = classification.annotations
    return annotations[annotations.length-1]

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
