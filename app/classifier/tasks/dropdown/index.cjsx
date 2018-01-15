React = require 'react'
createReactClass = require 'create-react-class'
GenericTask = require('../generic.jsx').default
DropdownEditor = require './editor'
Select = require( 'react-select' ).default

Summary = createReactClass
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

module.exports = createReactClass
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

  getDefaultProps: ->
    task:
      selects: []

  componentWillMount: ->
    @menus = []

  componentDidMount: ->
    annotationValues = @props.annotation.value
    unless annotationValues.length
      @props.annotation.value = @props.task.selects.map -> {value: null, option: false}

    if @props.autoFocus is true
      @handleFocus()

  componentDidUpdate: (prevProps) ->
    if prevProps.task isnt @props.task and @props.autoFocus is true
      @handleFocus()

  selectedOptions: () ->
    # return annotation values mapped to react-select option objects
    selectedOptions = []
    @props.annotation.value.map (annotation, i) =>
      if annotation.option
        select = @props.task.selects[i]
        [selected] = @getOptions(i).filter (option) -> option.value is annotation.value
        selectedOptions[i] = selected
      else
        selectedOptions[i] = {label: annotation.value, value: annotation.value}
    selectedOptions

  handleFocus: ->
    @menus[0].focus()

  getOptionsKey: (i, optionsKey = '') ->
    {selects} = @props.task
    select = selects[i]
    [parentMenu] = selects.filter (filterSelect) => filterSelect.id is select.condition
    conditionIndex = selects.indexOf(parentMenu)
    optionsKey = if optionsKey.length is 0 then @props.annotation.value[conditionIndex]?.value else "#{@props.annotation.value[conditionIndex]?.value};#{optionsKey}"
    if parentMenu.condition? then @getOptionsKey(conditionIndex, optionsKey) else optionsKey

  getOptions: (i) ->
    select = @props.task.selects[i]
    optionsKey = if not select.condition? then '*' else @getOptionsKey(i)
    options = select.options[optionsKey]
    if options? then options else []

  getDisabledAttribute: (i) ->
    {selects} = @props.task
    select = selects[i]
    [condition] = selects.filter (filterSelect) => filterSelect.id is select.condition
    conditionIndex = selects.indexOf(condition)

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
          disabled = @getDisabledAttribute(i)
          selectedOption = if @selectedOptions()[i]?.value then @selectedOptions()[i] else null
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
              value={selectedOption}
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

    options = @getOptions(i)
    newIndex = options?.indexOf(option)
    if newIndex is -1 or newIndex is undefined
      value[i] = {value: option.value, option: false}
    else
      value[i] = {value: option.value, option: true}

    @clearRelated(i)

    newAnnotation = Object.assign @props.annotation, {value}
    @props.onChange newAnnotation
