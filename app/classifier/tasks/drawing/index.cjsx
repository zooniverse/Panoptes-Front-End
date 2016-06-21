React = require 'react'
GenericTaskEditor = require '../generic-editor'
Summary = require './summary'
MarkingInitializer = require './marking-initializer'
MarkingsRenderer = require './markings-renderer'
HidePreviousMarksToggle = require './hide-previous-marks-toggle'
GenericTask = require '../generic'
testShapeCloseness = require 'test-shape-closeness'
{Markdown} = (require 'markdownz').default
icons = require './icons'
drawingTools = require '../../drawing-tools'

module.exports = React.createClass
  displayName: 'DrawingTask'

  statics:
    Editor: GenericTaskEditor
    Summary: Summary
    InsideSubject: MarkingInitializer
    PersistInsideSubject: MarkingsRenderer
    PersistAfterTask: HidePreviousMarksToggle

    getDefaultTask: ->
      type: 'drawing'
      instruction: 'Explain what to draw.'
      help: ''
      tools: []

    getTaskText: (task) ->
      task.instruction

    getDefaultAnnotation: ->
      _toolIndex: 0
      value: []

    closeAllMarks: (task, annotation) ->
      for mark in annotation.value
        toolDescription = task.tools[mark.tool]
        ToolComponent = drawingTools[toolDescription.type]
        if ToolComponent.isComplete? and ToolComponent.forceComplete?
            unless ToolComponent.isComplete mark
              ToolComponent.forceComplete mark

    onLeaveAnnotation: (task, annotation) ->
      @closeAllMarks task, annotation

    areThereEnoughMarks:(task, annotation) ->
      marksByTool = {}
      annotation.value.forEach (mark) ->
        marksByTool[mark.tool] ?= 0
        marksByTool[mark.tool] += 1
      task.tools.every (toolDescription, i) ->
        (marksByTool[i] ? 0) >= (toolDescription.min ? 0)

    areMarksComplete: (task, annotation) ->
      tasks = require '..' # Circular
      for mark in annotation.value
        toolDescription = task.tools[mark.tool]
        for detail, i in toolDescription.details ? [] when detail.required
          subAnnotation = mark.details[i]
          DetailTaskComponent = tasks[detail.type]
          if DetailTaskComponent.isAnnotationComplete?
            unless DetailTaskComponent.isAnnotationComplete detail, subAnnotation
              return false
      true

    isAnnotationComplete: (task, annotation) ->
      # Booleans compare to numbers as expected: true = 1, false = 0. Undefined does not.
      @areMarksComplete(task, annotation) and @areThereEnoughMarks(task, annotation) and annotation.value.length >= (task.required ? 0)

    testAnnotationQuality: (unknown, knownGood, workflow) ->
      unknownTaskDescription = workflow.tasks[unknown.task]
      unknownShapes = unknown.value.map (annotationShape) ->
        toolDescription = unknownTaskDescription.tools[annotationShape.tool]
        Object.assign {}, annotationShape, type: toolDescription.type

      knownGoodTaskDescription = workflow.tasks[knownGood.task]
      knownGoodShapes = knownGood.value.map (annotationShape) ->
        toolDescription = knownGoodTaskDescription.tools[annotationShape.tool]
        Object.assign {}, annotationShape, type: toolDescription.type

      # TODO: This doesn't factor in details tasks at all.
      testShapeCloseness unknownShapes.concat knownGoodShapes

  getDefaultProps: ->
    task: null
    annotation: null
    onChange: Function.prototype

  activateTemplate: (type) ->
    @props.user.get('project_preferences', {project_id: @props.workflow.links.project}).then ([pref]) =>
      pref.update 'preferences.activeTemplate': type
      pref.save()

  clearTemplate: (type) ->
    @props.user.get('project_preferences', {project_id: @props.workflow.links.project}).then ([pref]) =>
      pref.update 'preferences.activeTemplate': null
      if type is 'row'
        pref.update "preferences.#{type}": null
        pref.save()
      else
        pref.preferences.savedGrids.shift()
        pref.update 'preferences.savedGrids': pref.preferences.savedGrids
        if pref.preferences.savedGrids.length > 0
          pref.update 'preferences.grid': pref.preferences.savedGrids[0].value
        else
          pref.update 'preferences.grid': null
        pref.save()

  saveTemplate: (marks, type) ->
    @props.user.get('project_preferences', {project_id: @props.workflow.links.project}).then ([pref]) =>
      pref.update 'preferences.activeTemplate': type
      if pref.preferences.grid and type is 'grid'
        @setState templateForm: true
        pref.update 'preferences.grid': marks
        pref.save()
      if !pref.preferences.grid and type is 'grid'
        @setState templateForm: true
        pref.update 'preferences.grid': marks
        pref.save()
      else if !pref.preferences.row and type is 'row'
        newArray = []
        lastCellMid = marks[marks.length - 1].y + marks[marks.length - 1].height / 2
        for cell in marks
          if cell.y < lastCellMid && (cell.y + cell.height) > lastCellMid
            newArray.push Object.assign({}, cell)
        pref.update 'preferences.row': newArray
      pref.save()

  onSubmit: (e) ->
    e.preventDefault()

    displayName = @refs.name.value
    @props.user.get('project_preferences', {project_id: @props.workflow.links.project}).then ([pref]) =>
      if !pref.preferences?.savedGrids?
        pref.update 'preferences.savedGrids': [{ value: @props.annotation.value, label: displayName, id: Math.random()}]
        pref.save()
      else
        pref.preferences.savedGrids.unshift({ value: @props.annotation.value, label: displayName, id: Math.random()})
        pref.update 'preferences.savedGrids': pref.preferences.savedGrids
        pref.save()
    @setState templateForm: false

  renderTemplateSave: ->
    <form onSubmit={@onSubmit} className="collections-create-form">
      <input className="collection-name-input" ref="name" placeholder="Template Name" />
    </form>

  render: ->
    tools = for tool, i in @props.task.tools
      tool._key ?= Math.random()
      count = (true for mark in @props.annotation.value when mark.tool is i).length
      <div>
        <label key={tool._key} >
          <input name={i} autoFocus={@props.autoFocus and i is 0} type="radio" className="drawing-tool-button-input" checked={i is (@props.annotation._toolIndex ? 0)} onChange={@handleChange.bind this, i} />
          <div className="minor-button answer-button #{if i is (@props.annotation._toolIndex ? 0) then 'active' else ''}">
            <div className="answer-button-icon-container">
              <span className="drawing-tool-button-icon" style={color: tool.color}>{icons[tool.type]}</span>
            </div>

            <div className="answer-button-label-container">
              <Markdown className="answer-button-label">{tool.label}</Markdown>
              <div className="answer-button-status">
                {count + ' '}
                {if tool.min? or tool.max?
                  'of '}
                {if tool.min?
                  <span style={color: 'red' if count < tool.min}>{tool.min} required</span>}
                {if tool.min? and tool.max?
                  ', '}
                {if tool.max?
                  <span style={color: 'orange' if count is tool.max}>{tool.max} maximum</span>}
                {' '}drawn
              </div>
            </div>
          </div>
          {if tool.type is 'grid'
            <div>
              <button type="button" className="tabbed-content-tab #{('active' if !@props.preferences.preferences?.activeTemplate) ? ''}" onClick={@activateTemplate.bind this, null} >
                Draw Cells
              </button><br />
              <button type="button" className="tabbed-content-tab #{('active' if @props.preferences.preferences?.activeTemplate is 'row') ? ''}" disabled={!@props.preferences.preferences.row} onClick={@activateTemplate.bind this, 'row'} >
                Draw Rows
              </button>
              <button type="button" onClick={@saveTemplate.bind this, @props.annotation.value, 'row'} disabled={@props.preferences.preferences?.row?}>
                Save Row Template
              </button>
              <button type="button" onClick={@clearTemplate.bind this, 'row'}>
                Clear Row Template
              </button><br />
              <button type="button" className="tabbed-content-tab #{('active' if @props.preferences.preferences?.activeTemplate is 'grid') ? ''}" disabled={!@props.preferences.preferences?.grid?} onClick={@activateTemplate.bind this, 'grid'} >
                Place Grid
              </button>
              <button type="button" onClick={@saveTemplate.bind this, @props.annotation.value, 'grid'}>
                Save New Grid Template
              </button>
              <button type="button" onClick={@clearTemplate.bind this, 'grid'}>
                Delete Active Grid Template
              </button>
            </div>}
            <div>
              { @renderTemplateSave() if @state?.templateForm }
            </div>
        </label>
        <select onChange={@logSomething}>
          {@props.preferences.preferences.savedGrids?.map (select, i) ->
              <option key={select.id} value={i}>{select.label}</option>}
        </select>
      </div>

    <GenericTask question={@props.task.instruction} help={@props.task.help} answers={tools} required={@props.task.required} />

  logSomething: (e) ->
    index = e.target.value
    @props.user.get('project_preferences', {project_id: @props.workflow.links.project}).then ([pref]) =>
      movedGrid = pref.preferences.savedGrids[index]
      pref.update 'preferences.grid': movedGrid.value
      pref.preferences.savedGrids.splice index, 1
      pref.preferences.savedGrids.unshift movedGrid
      pref.update 'preferences.savedGrids': pref.preferences.savedGrids
      pref.save()

  handleChange: (toolIndex, e) ->
    # This handles changing tools, not any actually drawing.
    # The annotation value is updated by the MarkingInitializer and the individual tools themselves.
    @constructor.closeAllMarks @props.task, @props.annotation
    if e.target.checked
      newAnnotation = Object.assign {}, @props.annotation, _toolIndex: toolIndex
      @props.onChange newAnnotation
