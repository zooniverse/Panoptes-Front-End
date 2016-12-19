React = require 'react'
TriggeredModalForm = require 'modal-form/triggered'
tasks = require '../../../classifier/tasks'
{Markdown} = require 'markdownz'

# All classes in this file take in `workflow` and `taskKey` as props

# Render the task name box
TaskName = React.createClass
  displayName: 'TaskName'

  render: ->
    task = @props.workflow[@props.taskKey]
    taskText = tasks[task.type].getTaskText(task)
    style =
      'zindex': 'inherit'
    <div className='answer-item' id={@props.plumbId + '_name'} style={style}>
      <Markdown className='lab markdown-vis'>{taskText}</Markdown>
    </div>

# Render require checkbox
RequireBox = React.createClass
  displayName: 'RequireBox'

  render: ->
    task = @props.workflow[@props.taskKey]
    <span className='req'>
      Required
      <input className='reqired-check' type='checkbox' checked={task.required} disabled={true} />
    </span>

# Render modal to show task help text
HelpButton = React.createClass
  displayName: 'HelpButton'

  render: ->
    task = @props.workflow[@props.taskKey]
    helpText = task.help
    style =
      zIndex: @props.zIndex
    <TriggeredModalForm trigger={
      <span className="standard-button help-text-vis">
        Help text
      </span>
    } underlayStyle={style}>
      <div className='help-preview'>
        <Markdown className='markdown-vis'>{helpText}</Markdown>
      </div>
    </TriggeredModalForm>

module.exports = {
  TaskName
  RequireBox
  HelpButton
}
