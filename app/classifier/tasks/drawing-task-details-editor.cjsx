React = require 'react'
AutoSave = require '../../components/auto-save'
TriggeredModalForm = require 'modal-form/triggered'


module.exports = React.createClass
  displayName: 'DrawingTaskDetailsEditor'

  getDefaultProps: ->
    workflow: null
    task: null
    details: null
    toolIndex: NaN
    toolPath: ''
    onClose: null

  render: ->
    GenericTaskEditor = require './generic-editor' # Work around circular dependency.

    <div className="drawing-task-details-editor">
      <div className="sub-tasks">
        {if @props.details.length is 0
          <span className="form-help">No sub-tasks defined for this tool</span>
        else
          for subtask, i in @props.details
            subtask._key ?= Math.random()
            <div key={subtask._key} className="drawing-task-details-editor-subtask-wrapper">
              <GenericTaskEditor
                workflow={@props.workflow}
                task={subtask}
                taskPrefix="#{@props.toolPath}.details.#{i}"
                isSubtask={true}
                onChange={@handleSubtaskChange.bind this, i}
                onDelete={@handleSubtaskDelete.bind this, i}
              />
              <AutoSave resource={@props.workflow}>
                <button type="button" className="subtask-delete" aria-label="Remove subtask" title="Remove subtask" onClick={@handleSubtaskDelete.bind this, i}>&times;</button>
              </AutoSave>
            </div>}
      </div>

      <div className="commands columns-container">
        <p>
          <TriggeredModalForm trigger={
            <span className="standard-button">
              <i className="fa fa-plus-circle"></i>{' '}
              Add a task
            </span>
          }>
              <button type="submit" className="minor-button" onClick={@handleAddTask.bind this, 'single'} title="Question tasks: the volunteer chooses from among a list of answers but does not mark or draw on the image(s).">
                <i className="fa fa-question-circle fa-2x"></i>
                <br />
                <small><strong>Question</strong></small>
              </button>{' '}
              {
                if @canUseTask("text")
                  <button type="submit" className="minor-button" onClick={@handleAddTask.bind this, 'text'} title="Text tasks: the volunteer writes free-form text into a dialog box.">
                    <i className="fa fa-file-text-o fa-2x"></i>
                    <br />
                    <small><strong>Text</strong></small>
                  </button>
              }
          </TriggeredModalForm>
        </p>
      </div>
    </div>

  canUseTask: (task)->
    task in @props.project.experimental_tools

  handleAddTask: (task) ->
    switch task
      when 'single' 
        TaskChoice = require './single'
      when 'text'
        TaskChoice = require './text'
    @props.task.tools[@props.toolIndex].details.push TaskChoice.getDefaultTask()
    @props.workflow.update 'tasks'
    @props.workflow.save()

  handleSubtaskChange: (subtaskIndex, path, value) ->
    console?.log 'Handling subtask change', arguments...
    taskKey = (key for key, description of @props.workflow.tasks when description is @props.task)[0]
    changes = {}
    changes["#{@props.toolPath}.details.#{subtaskIndex}.#{path}"] = value
    @props.workflow.update(changes).save()
    console?.log changes, @props.workflow

  handleSubtaskDelete: (subtaskIndex) ->
    @props.task.tools[@props.toolIndex].details.splice subtaskIndex, 1
    @props.workflow.update('tasks').save()
