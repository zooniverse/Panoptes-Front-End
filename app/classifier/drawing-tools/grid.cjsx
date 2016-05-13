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

  statics:
    initCoords: null

    defaultValues: ({x, y}) ->
      x: x
      y: y
      width: 0
      height: 0

    savedRow: ->

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
      mark.width > MINIMUM_SIZE and mark.height > MINIMUM_SIZE

  initCoords: null

  render: ->
    @findSchema()
    {x, y, width, height} = @props.mark

    points = [
      [x, y].join ','
      [x + width, y].join ','
      [x + width, y + height].join ','
      [x, y + height].join ','
      [x, y].join ','
    ].join '\n'

    <DrawingToolRoot tool={this}>
      <polyline points={points} onClick={@destroyTool.bind null, this} />
    </DrawingToolRoot>

  destroyTool: ->
    if window.confirm 'Do you want to delete this cell?'
      this.setState destroying: true

  findSchema: ->
    @props.user.get('project_preferences', {project_id: @props.workflow.links.project}).then ([pref]) =>
      if pref.preferences.grid.inProgress
