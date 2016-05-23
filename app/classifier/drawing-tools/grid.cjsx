React = require 'react'
DrawingToolRoot = require './root'
DragHandle = require './drag-handle'
Draggable = require '../../lib/draggable'
deleteIfOutOfBounds = require './delete-if-out-of-bounds'
DeleteButton = require './delete-button'
Rectangle = require './rectangle'

MINIMUM_SIZE = 5
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
      type: 'cell'

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

    # This must be rewritten. It is likely an annotation will be destroyed when it's a row as the cursor doesn't move much to the left or right
    # initValid: (mark) ->
    #   mark.width > MINIMUM_SIZE and mark.height > MINIMUM_SIZE

    saveState: (mark, template) ->
      for cell in template
        cell.y = mark.y
        cell.height = mark.height
        cell.type = 'row'
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
    </DrawingToolRoot>

  renderGrid: ->
    for cell in @state.grid
      points = @pointFinder cell
      <polyline points={points} />

  renderRow: ->
    for cell in @state.row
      points = @pointParser cell
      <polyline points={points} />

  handleMainDrag: (e, d) ->
    @props.mark.x += d.x / @props.scale.horizontal
    @props.mark.y += d.y / @props.scale.vertical
    @props.onChange @props.mark

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
    @props.user.get('project_preferences', {project_id: @props.workflow.links.project}).then ([pref]) =>
      if pref.preferences.row?.length
        @setState row: pref.preferences.row
      if pref.preferences.grid?.length
        @setState grid: pref.preferences.grid
