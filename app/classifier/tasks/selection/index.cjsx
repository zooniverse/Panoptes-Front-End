React = require 'react'
GenericTask = require '../generic'
SelectionTaskEditor = require './editor'

Summary = React.createClass
  displayName: 'SelectionSummary'

  getDefaultProps: ->
    task: {}
    annotation: {}

  render: ->
    {answers} = @props.task

    <div className="classification-task-summary">
      <div className="question">{@props.task.instruction}</div>

      <div className="answers">
        {if @props.annotation.value
          Object.keys(answers).map (key, i) =>
            <div key={i} className="answer">
              <i className="fa fa-arrow-circle-o-right" /> {@props.annotation?.value[key]}
            </div>
        }
      </div>
    </div>

module?.exports = React.createClass
  displayName: 'SelectionTask'

  statics:
    Editor: SelectionTaskEditor
    Summary: Summary

    getDefaultTask: ->
      type: 'selection'
      instruction: 'Select options from a list'
      help: 'Click on the select box to choose an option'
      answers: {}
      answersOrder: []

    getTaskText: (task) ->
      task.instruction

    getDefaultAnnotation: ->
      value: {}

    isAnnotationComplete: (task, annotation) ->
      answer = (key) -> annotation.value[key]
      answersCompleted = Object.keys(annotation.value)
        .map(answer)
        .filter(Boolean)

      answersCompleted.length and (answersCompleted.length is Object.keys(task.answers).length)

  render: ->
    {answers, answersOrder} = @props.task
    selectBoxes = if answersOrder.length then answersOrder else Object.keys(answers)

    <GenericTask question={@props.task.instruction} help={@props.task.help} required={@props.task.required}>
      <div className="selection-task">

        {selectBoxes.map (name, i) =>
          <div>
            <div>{answers[name].title}</div>
            <select key={i} defaultValue={@props.annotation.value[name] ? ""} ref="select-#{name}" onChange={@onChangeSelect.bind(@, selectBoxes)}>
              <option key="_title" value="" disabled>--</option>

              {answers[name].values.map (option, i) =>
                <option key={i} value={option.value}>
                  {option.label}
                </option>}
            </select>
          </div>
          }

      </div>
    </GenericTask>

  onChangeSelect: (selectBoxes, e) ->
    currentAnswers = selectBoxes.reduce((obj, name) =>
      obj[name] = @refs["select-#{name}"].value
      obj
    , {})

    @props.annotation.value = currentAnswers
    @props.onChange()
