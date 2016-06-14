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
      templateID = Math.random()
      if type is 'row'
        for cell in template
          cell.reorder = false
          cell.y = mark.y
          cell.height = mark.height
          cell.templateID = templateID
        template
      else
        for cell in template
          cell.reorder = false
          cell.templateID = templateID
        template

  initCoords: null

  render: ->
    points = @pointFinder @props.mark

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
    totalPoints = []
    for cell in @state.grid
      points = @pointFinder cell
      totalPoints.push points
    <polyline points={totalPoints.join()} />

  renderRow: ->
    totalPoints = []
    if @props.mark.renderDrag is true #is this necessary?
      for cell in @state.row
        points = @pointRow cell
        totalPoints.push points
    else
      for cell in @state.row
        # if cell is @state.row[0]
        #   @markChange cell
        points = @pointParser cell
        totalPoints.push points
    <Draggable onDrag={@handleRowDrag} onEnd={deleteIfOutOfBounds.bind null, this} disabled={@props.disabled}>
      <polyline key={Math.random()} points={totalPoints.join()} />
    </Draggable>

  markChange: (cell) -> # this should change mark into first grid item, not entire row
    @props.mark.x = cell.x
    @props.mark.width = cell.width

  handleRowDrag: (e, d) ->
    @props.mark.renderDrag = true
    newRows = @state.row
    alteringRows = (i for i in @props.classification.annotations[0].value when i.templateID is @props.mark.templateID)
    for cell in alteringRows
      cell.x += d.x / @props.scale.horizontal
      cell.y += d.y / @props.scale.vertical
    @setState row: alteringRows

  handleMainDrag: (e, d) ->
    @props.mark.x += d.x / @props.scale.horizontal
    @props.mark.y += d.y / @props.scale.vertical
    @props.onChange @props.mark

  pointRow: (cell) ->
    {y, height} = @props.mark
    points = [
      [cell.x, y].join ','
      [cell.x + cell.width, y].join ','
      [cell.x + cell.width, y + height].join ','
      [cell.x, y + height].join ','
      [cell.x, y].join ','
    ].join '\n'

  pointFinder: (mark) ->
    {x, y, width, height} = mark
    [
      [x, y].join ','
      [x + width, y].join ','
      [x + width, y + height].join ','
      [x, y + height].join ','
      [x, y].join ','
    ].join '\n'

  pointParser: (cell) ->
    {y, height} = @props.mark
    points = [
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
            if proj.preferences.activeTemplate == 'row'
              @setState row: proj.preferences.row
            if proj.preferences.activeTemplate == 'grid'
              @setState grid: proj.preferences.grid
      .catch =>
