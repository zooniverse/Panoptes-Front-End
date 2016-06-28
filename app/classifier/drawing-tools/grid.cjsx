React = require 'react'
DrawingToolRoot = require './root'
Draggable = require '../../lib/draggable'
deleteIfOutOfBounds = require './delete-if-out-of-bounds'
DeleteButton = require './delete-button'

MINIMUM_SIZE = 10

module.exports = React.createClass
  displayName: 'GridTool'

  componentWillMount: ->
    console.log 'mounting'
    if @props.mark.prerendered and @props.preferences.preferences[@props.mark.type]
      newTemplate = @templateRerender @props.mark, @props.preferences.preferences[@props.mark.type]
      @setState template: newTemplate
      @setState activeTemplate: @props.mark.type
    unless @props.mark.prerendered
      @findSchema()

  componentWillUnmount: ->
    console.log 'unmounting!'
    @props.mark.prerendered = true

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
      templateCopy = []
      mark.reorder = false
      mark.type = type
      mark.templateID = templateID
      if type is 'row'
        mark.x = template[0].x
        mark.width = template[0].width
      if type is 'grid'
        mark.x = template[0].x
        mark.width = template[0].width
        mark.y = template[0].y
        mark.height = template[0].height
      for cell in template
        templateCopy.push Object.assign({}, cell)
      templateCopy.shift()
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
          cell._key = Math.random()
          cell.reorder = false
          cell.templateID = templateID
        templateCopy

  initCoords: null

  render: ->
    points = @cellPoints @props.mark

    <DrawingToolRoot tool={this}>
      {if @state?.template
        @renderTemplate()
      else
        <Draggable onDrag={@handleMainDrag} onEnd={deleteIfOutOfBounds.bind null, this} disabled={@props.disabled}>
          <polyline points={points} />
        </Draggable>}
        {if @props.selected
          <g>
            <DeleteButton tool={this} x={@props.mark.x} y={@props.mark.y} />
          </g>}
    </DrawingToolRoot>

  renderTemplate: ->
    for cell in @state.template
      points = @cellPoints cell if @state.activeTemplate is 'grid'
      points = @rowPoints cell if @state.activeTemplate is 'row'
      <Draggable key={Math.random()} onDrag={@handleTemplateDrag} onEnd={deleteIfOutOfBounds.bind null, this} disabled={@props.disabled}>
        <polyline points={points} />
      </Draggable>

  handleTemplateDrag: (e, d) ->
    alteringRows = (i for i in @props.classification.annotations[0].value when i.templateID is @props.mark.templateID)
    for cell in alteringRows
      cell.x += d.x / @props.scale.horizontal
      cell.y += d.y / @props.scale.vertical
    @setState template: alteringRows

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

  templateRerender: (mark, template) ->
    changeX = mark.x - template[0].x
    changeY = mark.y - template[0].y
    for cell in template
      cell.x = cell.x + changeX
      cell.y = cell.y + changeY if mark.type is 'grid'
    template

  findSchema: ->
    @props.user.get('project_preferences')
      .then (projects) =>
        for proj in projects
          if proj.links.project == @props.workflow.links.project
            if proj.preferences.activeTemplate
              @setState activeTemplate: proj.preferences.activeTemplate
              @setState template: proj.preferences[proj.preferences.activeTemplate]
      .catch =>
