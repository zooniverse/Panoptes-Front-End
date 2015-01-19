{Resource, Type} = require 'json-api-client'
React = require 'react'
ChangeListener = require '../components/change-listener'

window.EXAMPLE_WORKFLOW = new Resource
  _type: new Type 'workflows'
  handleInputChange: (e) ->
    valueProp = switch e.target.type
      when 'radio', 'checkbox' then 'checked'
      else 'value'

    value = e.target[valueProp]

    if e.target.type.indexOf('select') is 0 and value is ''
      value = null

    data = this
    path = e.target.name.split '.'
    until path.length is 1
      data = data[path.shift()]
    data[path[0]] = value
    @emit 'change'

AnswerEditor = React.createClass
  displayName: 'AnswerEditor'

  render: ->
    <div className="answer">
      <div className="controls">
        <button type="button" className="delete-answer" onClick={@props.remove}>&times;</button>
      </div>

      <label>
        <span className="field-label">Label</span>
        <br />
        <textarea name="tasks.#{@props.taskKey}.answers.#{@props.answerIndex}.label" value={@props.answer.label} onChange={@props.workflow.handleInputChange.bind @props.workflow} rows="1" style={width: '100%'} />
      </label>
      <br />

      <div className="answer-properties">
        <label>
          Next task <select name="tasks.#{@props.taskKey}.answers.#{@props.answerIndex}.next" value={@props.answer.next} onChange={@props.workflow.handleInputChange.bind @props.workflow}>
            <option value="">Next</option>
            {for key, task of @props.workflow.tasks
              <option key={key} value={key}>{task.question ? task.instruction} ({key})</option>}
          </select>
        </label>
      </div>
    </div>

QuestionTaskEditor = React.createClass
  displayName: 'QuestionTaskEditor'

  render: ->
    <div>
      <label>
        <span className="field-label">Question</span>
        <br />
        <textarea name="tasks.#{@props.taskKey}.question" value={@props.task.question} onChange={@props.workflow.handleInputChange.bind @props.workflow} rows="2" style={width: '100%'} />
      </label>
      <br />

      <span className="field-label">Answers</span>
      <label className="inline-input">
        <input type="checkbox" name="tasks.#{@props.taskKey}.multiple" checked={@props.task.multiple || null} onChange={@props.workflow.handleInputChange.bind @props.workflow} />
        Multiple choice
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

  addAnswer: ->
    @props.task.answers ?= []
    @props.task.answers.push
      label: ''
      next: null
    @props.workflow.emit 'change'

  removeAnswer: (index) ->
    @props.task.answers.splice index, 1
    @props.workflow.emit 'change'

FeatureEditor = React.createClass
  displayName: 'FeatureEditor'

  render: ->
    <div className="answer">
      <div className="controls">
        <button type="button" className="delete-answer" onClick={@props.remove}>&times;</button>
      </div>

      <label>
        <span className="field-label">Label</span>
        <br />
        <textarea name="tasks.#{@props.taskKey}.features.#{@props.featureIndex}.label" value={@props.feature.label} onChange={@props.workflow.handleInputChange.bind @props.workflow} rows="1" style={width: '100%'} />
      </label>
      <br />

      <div className="answer-properties">
        <label>
          Shape <select name="tasks.#{@props.taskKey}.features.#{@props.featureIndex}.shape" value={@props.feature.shape} onChange={@props.workflow.handleInputChange.bind @props.workflow}>
            <option value="point">Point</option>
            <option value="ellipse">Ellipse</option>
          </select>
        </label>

        <label>
          Color <select name="tasks.#{@props.taskKey}.features.#{@props.featureIndex}.color" value={@props.feature.color} onChange={@props.workflow.handleInputChange.bind @props.workflow}>
            <option value="">(Default)</option>
            <option value="#f00">Red</option>
            <option value="#ff0">Yellow</option>
            <option value="#0f0">Green</option>
            <option value="#0ff">Cyan</option>
            <option value="#00f">Blue</option>
            <option value="#f0f">Magenta</option>
          </select>
        </label>
      </div>
    </div>

MarkingTaskEditor = React.createClass
  displayName: 'MarkingTaskEditor'

  render: ->
    <div>
      <label>
        <span className="field-label">Instruction</span>
        <br />
        <textarea name="tasks.#{@props.taskKey}.instruction" value={@props.task.instruction} onChange={@props.workflow.handleInputChange.bind @props.workflow} rows="2" style={width: '100%'} />
      </label>
      <br />

      <span className="field-label">Features to mark</span>
      <br />
      <div className="answers-list">
        {for feature, i in @props.task.features ? []
          <FeatureEditor key={i} {...@props} featureIndex={i} feature={feature} remove={@removeFeature.bind this, i} />}

        <div className="adder-container">
          <button type="button" className="adder" onClick={@addFeature}>Add a new feature</button>
        </div>
      </div>
    </div>

  addFeature: ->
    @props.task.features ?= []
    @props.task.features.push
      label: ''
      shape: 'point'
      color: null
    @props.workflow.emit 'change'

  removeFeature: (index) ->
    @props.task.features.splice index, 1
    @props.workflow.emit 'change'

TaskEditor = React.createClass
  displayName: 'TaskEditor'

  render: ->
    task = @props.workflow.tasks[@props.taskKey]

    TaskComponent = switch task.type
      when 'question', 'multiple' then QuestionTaskEditor
      when 'marking' then MarkingTaskEditor

    <div className="task">
      <div className="controls">
        {@props.taskKey} <button type="button" onClick={@remove}>&times;</button>
      </div>
      <TaskComponent {...@props} task={task} />
    </div>

  remove: ->
    delete @props.workflow.tasks[@props.taskKey]
    if @props.taskKey is @props.workflow.first_task
      delete @props.workflow.first_task
    @props.workflow.emit 'change'

module.exports = React.createClass
  displayName: 'WorkflowEditor'

  getDefaultProps: ->
    workflow: window.EXAMPLE_WORKFLOW

  getInitialState: ->
    view: 'editor'

  render: ->
    <ChangeListener target={@props.workflow} eventName="change" handler={@renderWorkflow} />

  renderWorkflow: ->
    view = switch @state.view
      when 'editor' then @renderEditor
      when 'code' then @renderCode

    <div className="workflow-editor-container" style={margin: '1em'}>
      <div className="controls">
        <button onClick={@setState.bind this, view: 'editor', null}><i className="fa fa-pencil fa-fw"></i></button>
        <button onClick={@setState.bind this, view: 'code', null}><i className="fa fa-code fa-fw"></i></button>
      </div>
      <br />
      {view()}
    </div>

  renderEditor: ->
    <div className="workflow-editor">
      <label>
        Name
        <br />
        <input type="text" name="display_name" value={@props.workflow.display_name} onChange={@props.workflow.handleInputChange.bind @props.workflow} style={width: '100%'} />
      </label>
      <hr />

      Tasks
      <br />
      <div className="task-list">
        {for taskKey in @getTaskKeysInOrder()
          <TaskEditor key={taskKey} taskKey={taskKey} workflow={@props.workflow} />}
      </div>

      <span className="field-label">Add a new task</span>
      <br />
      <div className="adder-container">
        <button type="button" className="adder" onClick={@addNewTask.bind this, 'question'}>Question</button>
        <button type="button" className="adder" onClick={@addNewTask.bind this, 'marking'}>Marking</button>
        <button type="button" className="adder" onClick={@addNewTask.bind this, 'survey'} disabled>Image survey</button>
      </div>
    </div>

  renderCode: ->
    <div className="workflow-editor-code-view">
      <pre>{JSON.stringify @props.workflow, null, 2}</pre>
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

    @props.workflow.emit 'change'
