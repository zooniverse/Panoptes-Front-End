React = require 'react'
AutoSave = require '../../components/auto-save'
handleInputChange = require '../../lib/handle-input-change'

module.exports = React.createClass
  displayName: 'NothingHereSelector'

  getDefaultProps: ->
    workflow: null
    task: null

  toggleNothingHere: (e) ->
    if e.target.checked
      @props.task.nothingHere = []
      @addAnswer()
    else
      @props.task.nothingHere = false
    @props.workflow.update 'tasks'

  addAnswer: ->
    @props.task.nothingHere.push
      label: 'Enter an answer'
    @props.workflow.update 'tasks'

  removeChoice: (choicesName, index) ->
    @props.task.nothingHere.splice index, 1
    @props.workflow.update 'tasks'

  render: ->
    handleChange = handleInputChange.bind @props.workflow
    nothingHelp = 'Check this box to give the volunteer an option to skip to the end of a classification if a subject does not contain relevant information.'

    <div>
      <label title={nothingHelp}>
        <AutoSave resource={@props.workflow}>
          <span className="form-label">Nothing Here Option</span>{' '}
          <input type="checkbox" checked={@props.task.nothingHere} onChange={@toggleNothingHere} />
        </AutoSave>
      </label>

        {if @props.task.nothingHere
          <div className="workflow-task-editor-choices">
            {if (@props.task.nothingHere.length ? 0) is 0 # Work around the empty-array-becomes-null bug on the back end.
              <span className="form-help">No <code>{choicesKey}</code> defined for this task.</span>}
            {for shortcut, index in @props.task.nothingHere
              shortcut._key ?= Math.random()
              <div key={shortcut._key} className="workflow-choice-editor">
                <AutoSave resource={@props.workflow}>
                  <textarea name="#{@props.taskPrefix}.nothingHere.#{index}.label" value={shortcut.label} onChange={handleChange} />
                </AutoSave>

                <AutoSave resource={@props.workflow}>
                  <button type="button" className="workflow-choice-remove-button" title="Remove choice" onClick={@removeChoice.bind this, 'nothingHere', index}>&times;</button>
                </AutoSave>
              </div>}

              <AutoSave resource={@props.workflow}>
                <button type="button" className="workflow-choice-add-button" title="Add Shortcut" onClick={@addAnswer.bind null, this}>+</button>
              </AutoSave>

            </div>}

      {' '}
    </div>
