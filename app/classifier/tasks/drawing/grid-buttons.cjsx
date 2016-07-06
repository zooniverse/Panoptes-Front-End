React = require 'react'
Select = require 'react-select'

module.exports = React.createClass
  displayName: 'GridButtons'

  getDefaultProps: ->
    preferences: null

  componentWillMount: ->
    if @props.preferences?.preferences?.grid?
      @clearRow()
      @activateTemplate 'grid'

  componentWillUnmount: ->
    rowID = false
    @props.annotation.value.map (mark) ->
      rowID = true if mark._rowID
    if rowID is true
      @rowMap '_rowID'
    else
      @rowMap 'templateID'

  rowMap: (templateType) ->
    @props.annotation.value.sort (a,b) ->
      parseFloat(a.y) - parseFloat(b.y) || parseFloat(a.x) - parseFloat(b.x)
    tempID = null
    column = 'a'
    row = 1
    for cell in @props.annotation.value
      if cell[templateType]
        tempID = cell[templateType] if tempID is null
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

  activateTemplate: (type) ->
    @props.preferences.preferences.activeTemplate = type
    @props.preferences.update 'preferences'
    if type is 'grid'
      @setState hideDrawingTools: true
    if type is null
      @setState hideDrawingTools: false

  clearRow: ->
    @removeMarks 'row'
    @activateTemplate null
    @props.preferences.preferences.row = null
    @props.preferences.update 'preferences'

  removeMarks: (type) ->
    marks = @props.annotation.value.filter((mark) =>
      mark if mark._type != type
    )
    @props.annotation.value = marks
    @props.preferences.update 'preferences'

  deleteGrid: ->
    @props.user.get('project_preferences', {project_id: @props.workflow.links.project}).then ([pref]) =>
      pref.preferences.savedGrids.pop()
      if pref.preferences?.savedGrids?.length > 0
        pref.update 'preferences.grid': pref.preferences.savedGrids[pref.preferences.savedGrids.length - 1].template
      else
        pref.update 'preferences.grid': null
        @activateTemplate null
        @setState hideDrawingTools: false
      pref.save()

  saveRow: (marks) ->
    @activateTemplate 'row'
    lastCellMidpoint = marks[marks.length - 1].y + marks[marks.length - 1].height / 2
    savedRow = []
    for cell in marks
      if cell.y < lastCellMidpoint && (cell.y + cell.height) > lastCellMidpoint
        savedRow.push Object.assign({}, cell)
    @props.preferences.preferences.row = savedRow
    @props.preferences.update 'preferences'

  saveGrid: (e) ->
    @props.annotation._completed = true
    e.preventDefault()
    @activateTemplate 'grid'

    newGrid = for cell in @props.annotation.value
      Object.assign({}, cell)
    displayName = @refs.name.value
    @props.user.get('project_preferences', {project_id: @props.workflow.links.project}).then ([pref]) =>
      pref.update 'preferences.grid': newGrid
      if !pref.preferences?.savedGrids?
        pref.update 'preferences.savedGrids': [{ value: Math.random(), label: displayName, template: newGrid}]
        pref.save()
      else
        pref.preferences.savedGrids.push { value: Math.random(), label: displayName, template: newGrid}
        pref.save()
    @setState templateForm: false
    @setState hideDrawingTools: true

  renderTemplateSave: ->
    <form onSubmit={@saveGrid} className="template-select">
      <input className="template-name-input" ref="name" placeholder="Template Name" /><br />
      <button type="submit" className="template-form-button">Save Template</button>
      <button type="button" className="template-form-button" onClick={@setState.bind this, templateForm: null, null}>Cancel</button>
    </form>

  changeGrid: (value) ->
    @activateTemplate 'grid'
    @props.preferences.preferences.savedGrids.map (grid, index) =>
      if grid.value is value
        @props.preferences.preferences.grid = grid.template
        @props.preferences.preferences.savedGrids.splice index, 1
        @props.preferences.preferences.savedGrids.push grid
        @props.preferences.update 'preferences'

  renderGridSelect: ->
    <div className="template-select">
      <p>Select Saved Grid:</p>
      <Select
        className='grid-selection-dropdown'
        clearable={false}
        onChange={@changeGrid}
        options={@props.preferences.preferences.savedGrids}
        scrollMenuIntoView={true}
        searchable={false}
        value={@props.preferences.preferences.savedGrids?[@props.preferences.preferences.savedGrids.length - 1]?.label}
      />
      <button type="button" className="template-form-button" onClick={@deleteGrid.bind this, null}>
        delete template
      </button><br /><br />
      <button type="button" className="template-form-button create-grid" onClick={@activateTemplate.bind this, null}>
        create new grid
      </button>
      <button type="button" className="template-form-button" onClick={@activateTemplate.bind this, 'grid'}>
        cancel
      </button>
    </div>

  render: ->
    @preferences = @props.preferences?.preferences
    @annotations = @props.annotation.value
    <div>

      { @renderGridSelect() if @preferences?.grid}

      {unless @state?.hideDrawingTools
        <table className="grid-button-table">
          <tbody>

            <tr>
              <td><li><button type="button" className="grid-button-tab #{('active' if !@preferences?.activeTemplate) ? ''}" onClick={@activateTemplate.bind this, null} > Draw Header </button></li></td>
              <td><button type="button" className="grid-button-template" disabled={!@annotations.length} onClick={@saveRow.bind this, @annotations}> done </button></td>
              <td><button type="button" className="grid-button-template" title='Remove all header cells' disabled={!@annotations.length} onClick={@removeMarks.bind this, 'cell'}> clear </button></td>
            </tr>

            <tr>
              <td><li><button type="button" className="grid-button-tab #{('active' if @preferences?.activeTemplate is 'row') ? ''}" disabled={!@preferences?.row} onClick={@activateTemplate.bind this, 'row'} > Draw Rows </button></li></td>
              <td><button type="button" className="grid-button-template" disabled={!@annotations.length or !@preferences.row} onClick={@setState.bind this, templateForm: true, null}> done </button></td>
              <td><button type="button" className="grid-button-template" title='Remove all rows and/or row template' disabled={!@preferences.row} onClick={@clearRow.bind this, null}> clear </button></td>
            </tr>

          </tbody>
        </table>}

        { @renderTemplateSave() if @state?.templateForm }

    </div>
