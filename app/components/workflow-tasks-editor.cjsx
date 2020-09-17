React = require 'react'
createReactClass = require 'create-react-class'
ChangeListener = require './change-listener'
handleInputChange = require('../lib/handle-input-change').default

AnswerEditor = createReactClass
  displayName: 'AnswerEditor'

  render: ->
    <div className="answer">
      <div className="controls">
        <button type="button" className="delete-answer" onClick={@props.remove}>&times;</button>
      </div>

      <label>
        <span className="field-label">Label</span>
        <br />
        <textarea name="tasks.#{@props.taskKey}.answers.#{@props.answerIndex}.label" value={@props.answer.label} onChange={handleInputChange.bind @props.workflow} rows="1" style={width: '100%'} />
      </label>
      <br />

      <div className="answer-properties">
        {if @props.task.type is 'single'
          <span>
            <label>
              {nextValue = @props.answer.next ? JSON.stringify(@props.answer.next) ? 'undefined'; null}
              Next task <select name="tasks.#{@props.taskKey}.answers.#{@props.answerIndex}.next" value={nextValue} onChange={handleInputChange.bind @props.workflow}>
                <option value="undefined" data-delete-value>(Next in line)</option>
                {for key, task of @props.workflow.tasks
                  <option key={key} value={key}>{"#{task.question ? task.instruction || '· · ·'} (#{key})"}</option>}
                <option value="null" data-json-value>(End classification)</option>
              </select>
            </label>
          </span>}
      </div>
    </div>

QuestionTaskEditor = createReactClass
  displayName: 'QuestionTaskEditor'

  render: ->
    <div>
      <label>
        <span className="field-label">Question</span>
        <br />
        <textarea name="tasks.#{@props.taskKey}.question" value={@props.task.question} onChange={handleInputChange.bind @props.workflow} rows="2" style={width: '100%'} />
      </label>
      <br />

      <span className="field-label">Answers</span>
      <label className="inline-input">
        <input type="checkbox" checked={@props.task.type is 'multiple' || null} onChange={@handleChangeMultiple} />
        Allow multiple
      </label>
      <br />

      <div className="answers-list">
        {for answer, i in @props.task.answers ? []
          <AnswerEditor key={i} {...@props} answerIndex={i} answer={answer} remove={@removeAnswer.bind this, i} />}

        <div className="adder-container">
          <button type="button" className="adder" onClick={@addAnswer}>Add a new answer</button>
        </div>
      </div>
    </div>

  handleChangeMultiple: (e) ->
    @props.task.type = if e.target.checked
        'multiple'
      else
        'single'
    @props.workflow.update 'tasks'

  addAnswer: ->
    @props.task.answers ?= []
    @props.task.answers.push
      label: ''
      next: null
    @props.workflow.update 'tasks'

  removeAnswer: (index) ->
    @props.task.answers.splice index, 1
    @props.workflow.update 'tasks'

ToolEditor = createReactClass
  displayName: 'ToolEditor'

  render: ->
    <div className="answer">
      <div className="controls">
        <button type="button" className="delete-answer" onClick={@props.remove}>&times;</button>
      </div>

      <label>
        <span className="field-label">Label</span>
        <br />
        <textarea name="tasks.#{@props.taskKey}.tools.#{@props.toolIndex}.label" value={@props.tool.label} onChange={handleInputChange.bind @props.workflow} rows="1" style={width: '100%'} />
      </label>
      <br />

      <div className="answer-properties">
        <span>
          <label>
            Shape <select name="tasks.#{@props.taskKey}.tools.#{@props.toolIndex}.shape" value={@props.tool.shape} onChange={handleInputChange.bind @props.workflow}>
              <option value="point">Point</option>
              <option value="ellipse">Ellipse</option>
            </select>
          </label>
        </span>

        <span>
          <label>
            Color <select name="tasks.#{@props.taskKey}.tools.#{@props.toolIndex}.color" value={@props.tool.color} onChange={handleInputChange.bind @props.workflow}>
              <option value="">(Default)</option>
              <option value="#f00">Red</option>
              <option value="#ff0">Yellow</option>
              <option value="#0f0">Green</option>
              <option value="#0ff">Cyan</option>
              <option value="#00f">Blue</option>
              <option value="#f0f">Magenta</option>
            </select>
          </label>
        </span>
      </div>
    </div>

DrawingTaskEditor = createReactClass
  displayName: 'DrawingTaskEditor'

  render: ->
    <div>
      <label>
        <span className="field-label">Instruction</span>
        <br />
        <textarea name="tasks.#{@props.taskKey}.instruction" value={@props.task.instruction} onChange={handleInputChange.bind @props.workflow} rows="2" style={width: '100%'} />
      </label>
      <br />

      <span className="field-label">Features to mark</span>
      <br />
      <div className="answers-list">
        {for tool, i in @props.task.tools ? []
          <ToolEditor key={i} {...@props} toolIndex={i} tool={tool} remove={@removeTool.bind this, i} />}

        <div className="adder-container">
          <button type="button" className="adder" onClick={@addTool}>Add a new tool</button>
        </div>
      </div>
    </div>

  addTool: ->
    @props.task.tools ?= []
    @props.task.tools.push
      label: ''
      shape: 'point'
      color: null
    @props.workflow.update 'tasks'

  removeTool: (index) ->
    @props.task.tools.splice index, 1
    @props.workflow.update 'tasks'

TaskEditor = createReactClass
  displayName: 'TaskEditor'

  render: ->
    task = @props.workflow.tasks[@props.taskKey]

    TaskComponent = switch task.type
      when 'single', 'multiple' then QuestionTaskEditor
      when 'drawing' then DrawingTaskEditor

    <div className="task">
      <div className="controls">
        {@props.taskKey} <button type="button" onClick={@props.remove}>&times;</button>
      </div>
      <TaskComponent {...@props} task={task} />
    </div>

module.exports = createReactClass
  displayName: 'WorkflowEditor'

  statics:
    willTransitionFrom: (transition, component) ->
      if component.props.workflow.hasUnsavedChanges()
        transition.abort()
        if confirm 'You have unsaved changes that will be lost forever. Do you really want to leave the workflow editor?'
          transition.retry()

  getDefaultProps: ->
    apiClient = require 'panoptes-client/lib/api-client'
    workflow: apiClient.type('workflows-for-dev-only').create
      display_name: 'Test workflow'
      tasks:
        cool:
          type: 'single'
          question: 'Cool?'
          answers: [
            label: 'Yep'
          ]
      first_task: 'cool'

  getInitialState: ->
    view: 'editor'

  render: ->
    <ChangeListener target={@props.workflow} eventName="change" handler={@renderWorkflow} />

  renderWorkflow: ->
    window.workflow = @props.workflow

    view = switch @state.view
      when 'editor' then @renderEditor
      when 'code' then @renderCode

    <div className="workflow-editor-container">
      <div className="controls">
        <button onClick={@setState.bind this, view: 'editor', null}><i className="fa fa-pencil fa-fw"></i></button>
        <button onClick={@setState.bind this, view: 'code', null}><i className="fa fa-code fa-fw"></i></button>
      </div>
      <br />
      {view()}
    </div>

  renderEditor: ->
    <div className="workflow-editor">
      <div className="task-list">
        {for taskKey in @getTaskKeysInOrder()
          <TaskEditor key={taskKey} taskKey={taskKey} workflow={@props.workflow} remove={@removeTask.bind this, taskKey} />}
      </div>

      <span className="field-label">Add a new task</span>
      <br />
      <div className="adder-container">
        <button type="button" className="adder" onClick={@addNewTask.bind this, 'single'}>Question</button>
        <button type="button" className="adder" onClick={@addNewTask.bind this, 'drawing'}>Marking</button>
        <button type="button" className="adder" onClick={@addNewTask.bind this, 'survey'} disabled>Image survey</button>
        <button type="button" className="adder" onClick={@addNewTask.bind this, 'flexibleSurvey'} disabled>Flexible Image Survey</button>
      </div>
    </div>

  renderCode: ->
    <div className="workflow-editor-code-view">
      <pre>{JSON.stringify @props.workflow.tasks, null, 2}</pre>
    </div>

  getTaskKeysInOrder: ->
    order = []
    key = @props.workflow.first_task
    while key?
      order.push key
      key = @props.workflow.tasks[key].next
    order

  addNewTask: (type) ->
    lastTaskKey = @getTaskKeysInOrder().pop()
    newTaskKey = Math.random().toString(16).split('.')[1]

    @props.workflow.tasks ?= {}
    @props.workflow.tasks[newTaskKey] = {type}

    if lastTaskKey?
      @props.workflow.tasks[lastTaskKey].next = newTaskKey
    else
      @props.workflow.first_task = newTaskKey

    @props.workflow.update 'tasks'

  removeTask: (taskKey) ->
    for key, task of @props.workflow.tasks
      # Remove the task from any task that declares it the next.
      if task.next is taskKey
        delete task.next
      if task.answers?
        # Remove the task from any answer that declares it the next.
        for answer in task.answers when answer.next is taskKey
          delete answer.next
    # Find a new first task, if we're removing the current one.
    if taskKey is @props.workflow.first_task
      @props.workflow.update first_task: @props.workflow.tasks[taskKey].next ? Object.keys(@props.workflow.tasks)[0]

    delete @props.workflow.tasks[taskKey]
    @props.workflow.update 'tasks'
