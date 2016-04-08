React = require 'react'

module.exports = React.createClass
  displayName: 'HidePreviousMarksButton'

  propTypes:
    task: React.PropTypes.object
    classification: React.PropTypes.object
    annotation: React.PropTypes.object

  getInitialState: ->
    hideMarks: false

  getCurrentAnnotation: ->
    classification = @props.classification
    annotations = classification.annotations
    return annotations[annotations.length-1]

  toggleHideMarks: (e) ->
    console.log 'toggleHideMarks()'
    @setState hideMarks: !@state.hideMarks, =>
      classification = @props.classification
      annotations = classification.annotations
      @props.classification._hidePreviousMarks = @state.hideMarks
      @props.classification._hideMarksBefore = if @state.hideMarks then annotations[annotations.length - 1].value.length - 1 else -1
      @props.classification.update()

  render: ->
    return null unless @props.task.enableHidePrevMarks
    # <button className='hide-previous-marks-button minor-button' onClick={@toggleHideMarks}>{if @state.hideMarks then 'Show' else 'Hide'} previous marks</button>
    <div>
     <p>
       <small>
         <strong>
           <label className="hide-previous-marks-toggle">
             <input checked={@state.hideMarks} type="checkbox" onClick={@toggleHideMarks} />
             {'Hide previous marks'}
           </label>
         </strong>
       </small>
     </p>
    </div>
