React = require 'react'
GenericTask = require('../generic.jsx').default
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

  componentWillMount: ->
    @menus = []
    @syncAnnotations()

  componentWillReceiveProps: (nextProps) ->
    if nextProps.task isnt @props.task
      @syncAnnotations()

  componentDidMount: ->
    if @props.autoFocus is true
      @handleFocus()

  componentDidUpdate: (prevProps) ->
    if prevProps.task isnt @props.task and @props.autoFocus is true
      @handleFocus()

  syncAnnotations: () ->
    # this can only be called after props have been updated
    # as it relies on props.task and props.annotation.
    # clear selections, then check each annotation.value
    # and set the corresponding selected option for each select
    if @props.annotation.value.length?
      for answer, i in @props.annotation.value
        @handleOptionsKeys(i, answer.value)

  handleFocus: ->
    @menus[0].focus()

  handleOptionsKeys: (i, value) ->
    {id, condition} = @props.task.selects[i]
    optionsKeys = @state.optionsKeys

    if value is null or i is 0 or i is '0'
      optionsKeys[id] = value
    else
      optionsKeys[id] = "#{optionsKeys[condition]};#{value}"
    @setState {optionsKeys}

  getOptions: (i) ->
    select = @props.task.selects[i]
    optionsKey = if not select.condition? then '*' else @state.optionsKeys[select.condition]
    select.options[optionsKey] or []

  getOptionFromAnnotation: (i) ->
    if @props.annotation.value[i]?.option is false and @props.annotation.value[i]?.value isnt null
      {value: @props.annotation.value[i]?.value, label: @props.annotation.value[i]?.value}
    else if @props.annotation.value[i]?.option is true
      filteredOption = @getOptions(i)?.filter (option) => option.value is @props.annotation.value[i]?.value
      filteredOption[0]
    else
      null

  getDisabledAttribute: (i) ->
    {selects} = @props.task
    select = selects[i]
    condition = selects.filter (filterSelect) => filterSelect.id is select.condition
    conditionIndex = selects.indexOf(condition[0])
    optionsKeys = @state.optionsKeys

    if select.condition? and select.allowCreate is false and not @props.annotation.value[conditionIndex]?.option
      true
    else
      false

  clearRelated: (i) ->
    {selects} = @props.task
    {id} = selects[i]
    relatedSelects = Object.keys(selects).filter (key) =>
      selects[key].condition is id
    for key in relatedSelects
      @onChangeSelect(key, {label: null, value: null})

  render: ->
    {selects} = @props.task

    <GenericTask question={@props.task.instruction} help={@props.task.help} required={@props.task.required}>
      <div>
        {selects.map (select, i) =>
          options = []
          options.push option for option in @getOptions(i)
          value = @getOptionFromAnnotation(i)
          disabled = @getDisabledAttribute(i)
          <div id={select.id} key={select.id}>
            {if select.title isnt @props.task.instruction
              <div>{select.title}</div>}
            {if select.allowCreate
              SelectComponent = Select.Creatable
            else
              SelectComponent = Select}
            <SelectComponent
              options={options}
              onChange={@onChangeSelect.bind(@, i)}
              value={value}
              disabled={disabled}
              placeholder={if disabled then "N/A"}
              noResultsText={if not options?.length then null}
              promptTextCreator={(label) -> "Press enter for #{label}…"}
              shouldKeyDownEventCreateNewOption={({keyCode}) -> keyCode is 13}
              matchPos="start"
              matchProp="label"
              ref={(instance) =>
                return unless instance
                if instance.select
                  @menus[i] = instance.select
                else
                  @menus[i] = instance
                }
            />
          </div>
        }
      </div>
    </GenericTask>

  onChangeSelect: (i, option = {label: null, value: null}) ->
    value = @props.annotation.value

    newOptionIndex = @getOptions(i)?.indexOf(option)

    if newOptionIndex is -1 or newOptionIndex is undefined
      value[i] = {value: option.value, option: false}
      @handleOptionsKeys(i, null)
    else
      value[i] = {value: option.value, option: true}
      @handleOptionsKeys(i, option.value)

    @clearRelated(i)

    newAnnotation = Object.assign @props.annotation, {value}
    @props.onChange newAnnotation
