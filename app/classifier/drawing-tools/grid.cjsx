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
  saveState: true

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
      # discover if we are in row mode. If so, make a mark for each item rendered

    initValid: (mark) ->
      mark.width > MINIMUM_SIZE and mark.height > MINIMUM_SIZE

  initCoords: null

  render: ->
    {x, y, width, height} = @props.mark

    points = [
      [x, y].join ','
      [x + width, y].join ','
      [x + width, y + height].join ','
      [x, y + height].join ','
      [x, y].join ','
    ].join '\n'

    <DrawingToolRoot tool={this}>
      {if @state?.template
        @renderCells()
      else
        <polyline points={points} onClick={@destroyTool.bind null, this} />}
    </DrawingToolRoot>

  renderCells: ->
    for cell in @state.template
      points = @pointParser cell
      <polyline points={points} onClick={@destroyTool.bind null, this} />

  pointParser: (cell) ->
    {y, height} = @props.mark
    points = [
      [cell.x, y].join ','
      [cell.x + cell.width, y].join ','
      [cell.x + cell.width, y + height].join ','
      [cell.x, y + height].join ','
      [cell.x, y].join ','
    ].join '\n'

  destroyTool: ->
    if window.confirm 'Do you want to delete this cell?'
      this.setState destroying: true

  findSchema: ->
    @props.user.get('project_preferences', {project_id: @props.workflow.links.project}).then ([pref]) =>
      if pref.preferences.cells.length
        @setState template: pref.preferences.cells
