React = require 'react'
createReactClass = require 'create-react-class'
DrawingToolRoot = require('./root').default
Draggable = require('../../lib/draggable').default
deleteIfOutOfBounds = require './delete-if-out-of-bounds'
DeleteButton = require './delete-button'

module.exports = createReactClass
  displayName: 'GridTool'

  statics:
    initCoords: null

    defaultValues: ({x, y}) ->
      x: x
      y: y
      width: 0
      height: 0
      _type: 'cell'

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

    initValid: (mark, props) ->
      if mark._type is 'grid'
        test = true
        props.annotation.value.map (cell) ->
          test = false if cell._type is 'grid' and cell.templateID != mark.templateID
        test
      else
        mark.height > 10

    saveState: (mark, template, type) ->
      templateID = Math.random()
      mark._type = type
      mark.templateID = templateID
      mark.x = template[0].x
      mark.width = template[0].width
      mark.y = template[0].y if type is 'grid'
      mark.height = template[0].height if type is 'grid'
      templateCopy = for cell in template
        Object.assign({}, cell)
      templateCopy.shift()
      for cell in templateCopy
        cell._rowID = cell.templateID if type is 'grid' and cell.templateID?
        cell._key = Math.random()
        cell._type = type
        cell.templateID = templateID
        cell._copy = true
        cell.y = mark.y if type is 'row'
        cell.height = mark.height if type is 'row'
      templateCopy

    mapCells: (annotations) ->
      currentAnnotation = annotations[annotations.length - 1]
      templateType = 'templateID'
      currentAnnotation.value.map (mark) ->
        templateType = '_rowID' if mark._rowID
      currentAnnotation.value.sort (a,b) ->
        parseFloat(a.y) - parseFloat(b.y) || parseFloat(a.x) - parseFloat(b.x)
      column = 'a'
      row = 1
      for cell in currentAnnotation.value
        if cell[templateType]
          tempID = cell[templateType] unless tempID
          if cell[templateType] == tempID
            cell.column = column
            cell.row = row
            column = String.fromCharCode(column.charCodeAt(0)+1)
          else
            row = row + 1
            tempID = cell[templateType]
            cell.column = 'a'
            cell.row = row
            column = 'b'

  initCoords: null

  componentWillMount: ->
    if @props.mark._prerendered and @props.preferences.preferences[@props.mark._type]
      @setState template: @templateRerender @props.mark, @props.preferences.preferences[@props.mark._type]
      @setState activeTemplate: @props.mark._type
    unless @props.mark._prerendered
      if @props.preferences.preferences.activeTemplate
        @setState activeTemplate: @props.preferences.preferences.activeTemplate
        @setState template: @props.preferences.preferences[@props.preferences.preferences.activeTemplate]

  componentWillUnmount: ->
    @props.mark._prerendered = true

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
            <DeleteButton tool={this} x={@props.mark.x} y={@props.mark.y} getScreenCurrentTransformationMatrix={@props.getScreenCurrentTransformationMatrix} />
          </g>}
    </DrawingToolRoot>

  renderTemplate: ->
    for cell in @state.template
      points = @cellPoints cell if @state.activeTemplate is 'grid'
      points = @rowPoints cell if @state.activeTemplate is 'row'
      <Draggable key={cell._key || Math.random()} onDrag={@handleTemplateDrag} onEnd={deleteIfOutOfBounds.bind null, this} disabled={@props.disabled}>
        <polyline points={points} />
      </Draggable>

  handleTemplateDrag: (e, d) ->
    difference = @props.normalizeDifference(e, d)
    mobileTemplate = (i for i in @props.annotations[@props.annotations.length - 1].value when i.templateID is @props.mark.templateID)
    for cell in mobileTemplate
      cell.x += difference.x
      cell.y += difference.y
    @setState template: mobileTemplate

  handleMainDrag: (e, d) ->
    difference = @props.normalizeDifference(e, d)
    @props.mark.x += difference.x
    @props.mark.y += difference.y
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
      cell.y = cell.y + changeY if mark._type is 'grid'
    template
