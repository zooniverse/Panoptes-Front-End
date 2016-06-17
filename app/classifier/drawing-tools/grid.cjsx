React = require 'react'
DrawingToolRoot = require './root'
DragHandle = require './drag-handle'
Draggable = require '../../lib/draggable'
deleteIfOutOfBounds = require './delete-if-out-of-bounds'
DeleteButton = require './delete-button'

MINIMUM_SIZE = 10
DELETE_BUTTON_DISTANCE = 9 / 10

module.exports = React.createClass
  displayName: 'GridTool'

  componentWillMount: ->
    @findSchema()

  statics:
    initCoords: null

    defaultValues: ({x, y}) ->
      x: x
      y: y
      width: 0
      height: 0

    initStart: ({x, y}, mark) ->
      @initCoords = {x, y}
      {x, y, _inProgress: true}

    initMove: (cursor, mark) ->
      if cursor.x > @initCoords.x
        width = cursor.x - mark.x
        x = mark.x
      else
        width = @initCoords.x - cursor.x
        x = cursor.x

      if cursor.y > @initCoords.y
        height = cursor.y - mark.y
        y = mark.y
      else
        height = @initCoords.y - cursor.y
        y = cursor.y

      {x, y, width, height}

    initRelease: (cursor, mark, e) ->
      _inProgress: false

    initValid: (mark) ->
      mark is null or mark.height > MINIMUM_SIZE

    saveState: (mark, template, type) ->
      templateCopy = []
      for cell in template
        templateCopy.push Object.assign({}, cell)
      templateID = Math.random()
      if type is 'row'
        for cell in templateCopy
          cell._key = Math.random()
          cell.reorder = false
          cell.y = mark.y
          cell.height = mark.height
          cell.templateID = templateID
        templateCopy
      else
        for cell in templateCopy
          cell.reorder = false
          cell.templateID = templateID
        templateCopy

  initCoords: null

  render: ->
    points = @cellPoints @props.mark

    <DrawingToolRoot tool={this}>
      {if @state?.grid
        @renderGrid()
      else if @state?.row
        @renderRow()
      else
        <Draggable onDrag={@handleMainDrag} onEnd={deleteIfOutOfBounds.bind null, this} disabled={@props.disabled}>
          <polyline points={points} />
        </Draggable>}
        {if @props.selected
          <g>
            <DeleteButton tool={this} x={@props.mark.x + (@props.mark.width * DELETE_BUTTON_DISTANCE)} y={@props.mark.y} />
          </g>}
    </DrawingToolRoot>

  renderGrid: ->
    console.log @props.preferences
    for cell in @state.grid
      points = @cellPoints cell
      <Draggable onDrag={@handleTemplateDrag} onEnd={deleteIfOutOfBounds.bind null, this} disabled={@props.disabled}>
        <polyline key={Math.random()} points={points} />
      </Draggable>

  renderRow: ->
    for cell in @state.row
      points = @rowPoints cell
      <Draggable onDrag={@handleTemplateDrag} onEnd={deleteIfOutOfBounds.bind null, this} disabled={@props.disabled}>
        <polyline key={Math.random()} points={points} />
      </Draggable>

  handleTemplateDrag: (e, d) ->
    newGrid = @state[@state.activeTemplate]
    alteringRows = (i for i in @props.classification.annotations[0].value when i.templateID is @props.mark.templateID)
    for cell in alteringRows
      cell.x += d.x / @props.scale.horizontal
      cell.y += d.y / @props.scale.vertical
    @setState grid: alteringRows

  handleMainDrag: (e, d) ->
    @props.mark.x += d.x / @props.scale.horizontal
    @props.mark.y += d.y / @props.scale.vertical
    @props.onChange @props.mark

  cellPoints: (mark) ->
    {x, y, width, height} = mark
    [
      [x, y].join ','
      [x + width, y].join ','
      [x + width, y + height].join ','
      [x, y + height].join ','
      [x, y].join ','
    ].join '\n'

  rowPoints: (cell) ->
    {y, height} = @props.mark
    [
      [cell.x, y].join ','
      [cell.x + cell.width, y].join ','
      [cell.x + cell.width, y + height].join ','
      [cell.x, y + height].join ','
      [cell.x, y].join ','
    ].join '\n'

  findSchema: ->
    @props.user.get('project_preferences')
      .then (projects) =>
        for project in projects
          if project.links.project == @props.workflow.links.project
            proj = project
            @setState preferences: proj.preferences
            if proj.preferences.activeTemplate
              @setState activeTemplate: proj.preferences.activeTemplate
            if proj.preferences.activeTemplate == 'row'
              @setState row: proj.preferences.row
            if proj.preferences.activeTemplate == 'grid'
              @setState grid: proj.preferences.grid
      .catch =>
