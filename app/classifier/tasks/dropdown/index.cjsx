React = require 'react'
GenericTask = require '../generic'
DropdownEditor = require './editor'
Select = require 'react-select'

Summary = React.createClass
  displayName: 'DropdownSummary'

  getDefaultProps: ->
    task: {}
    annotation: {}

  getOptionsKeys: ->
    optionsKeys = {}
    for answer, i in @props.annotation.value
      {id, condition} = @props.task.selects[i]

      if i is 0 or i is '0'
        optionsKeys[id] = answer.value
      else if answer.value is null
        optionsKeys[id] = null
      else
        optionsKeys[id] = "#{optionsKeys[condition]};#{answer.value}"
    optionsKeys

  getAnswer: (value, i) ->
    select = @props.task.selects[i]
    optionsKeys = @getOptionsKeys()
    optionsKey = if not select.condition? then '*' else optionsKeys[select.condition]
    options = select.options[optionsKey]
    option = options.filter (option) =>
      option.value is value
    option[0].label

  render: ->
    <div className="classification-task-summary">
      <div className="question">{@props.task.instruction}</div>
      <div className="answers">
        {for answer, i in @props.annotation.value
          if answer.option
            answer = @getAnswer(answer.value, i)
          else
            answer = answer.value
          <div key={i} className="answer">
            <i className="fa fa-arrow-circle-o-right" /> {@props.task.selects[i].title} - {answer}
          </div>
        }
      </div>
    </div>

module.exports = React.createClass
  displayName: 'DropdownTask'

  statics:
    Editor: DropdownEditor
    Summary: Summary

    getDefaultTask: ->
      type: 'dropdown'
      instruction: 'Select or type an option'
      help: ''
      selects: [
        {
          id: Math.random().toString(16).split('.')[1]
          title: 'Main Dropdown'
          required: true
          allowCreate: false
          options: {
            '*': []
          }
        }
      ]

    getTaskText: (task) ->
      task.instruction

    getDefaultAnnotation: ->
      value: []

    isAnnotationComplete: (task, annotation) ->
      task.selects.every (select, i) ->
        not select.required or (annotation.value[i]?.value? and annotation.value[i]?.value isnt "")

  getInitialState: ->
    optionsKeys: {}

  componentDidMount: ->
    annotationValues = @props.annotation.value
    if annotationValues.length
      for answer, i in annotationValues
        @handleOptionsKeys(i, answer.value)
    else
      @props.annotation.value = @props.task.selects.map -> {value: null, option: false}

    if @props.autoFocus is true
      @handleFocus()

  componentDidUpdate: (prevProps) ->
    if prevProps.task isnt @props.task and @props.autoFocus is true
      @handleFocus()

  handleFocus: ->
    @refs['select-0'].getInputNode().focus()

  handleOptionsKeys: (i, value) ->
    {id, condition} = @props.task.selects[i]
    optionsKeys = @state.optionsKeys

    if i is 0 or i is '0'
      optionsKeys[id] = value
    else if value is null
      optionsKeys[id] = null
    else
      optionsKeys[id] = "#{optionsKeys[condition]};#{value}"
    @setState optionsKeys: optionsKeys

  getOptions: (i) ->
    select = @props.task.selects[i]
    optionsKey = if not select.condition? then '*' else @state.optionsKeys[select.condition]
    select.options[optionsKey]

  getDisabledAttribute: (i) ->
    {selects} = @props.task
    select = selects[i]
    condition = selects.filter (filterSelect) => filterSelect.id is select.condition
    conditionIndex = selects.indexOf(condition[0])
    optionsKeys = @state.optionsKeys

    if select.condition? and not @props.annotation.value[conditionIndex]
      return true
    if select.condition? and select.allowCreate is false and not select.options[optionsKeys[select.condition]]?.length
      return true
    false

  clearRelated: (i) ->
    selects = @props.task.selects
    {id} = selects[i]
    relatedSelects = Object.keys(selects).filter (key) =>
      selects[key].condition is id
    for key in relatedSelects
      @onChangeSelect(key, null)

  render: ->
    {selects} = @props.task
    selectKeys = Object.keys(selects)

    <GenericTask question={@props.task.instruction} help={@props.task.help} required={@props.task.required}>
      <div>
        {selectKeys.map (i) =>
          options = @getOptions(i)
          disabled = @getDisabledAttribute(i)
          <div key={Math.random()}>
            {if selects[i].title isnt @props.task.instruction
              <div>{selects[i].title}</div>}
            <Select
              options={options}
              onChange={@onChangeSelect.bind(@, i)}
              value={@props.annotation.value[i]?.value}
              disabled={disabled}
              placeholder={if disabled then "N/A"}
              allowCreate={selects[i].allowCreate}
              noResultsText={if not options?.length then null}
              addLabelText="Press enter for {label}..."
              matchPos="start"
              matchProp="label"
              ref="select-#{i}"
            />
          </div>
        }
      </div>
    </GenericTask>

  onChangeSelect: (i, newValue) ->
    value = @props.annotation.value

    optionsValues = @getOptions(i)?.map (option) -> option.value
    newIndex = optionsValues?.indexOf(newValue)
    if newIndex is -1 or newIndex is undefined
      value[i] = {value: newValue, option: false}
      @handleOptionsKeys(i, null)
    else
      value[i] = {value: newValue, option: true}
      @handleOptionsKeys(i, newValue)

    @clearRelated(i)

    newAnnotation = Object.assign @props.annotation, {value}
    @props.onChange newAnnotation
