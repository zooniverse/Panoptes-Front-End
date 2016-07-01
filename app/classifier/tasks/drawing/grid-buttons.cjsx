React = require 'react'
Select = require 'react-select'

module.exports = React.createClass
  displayName: 'GridButtons'

  componentWillMount: ->
    if @props.preferences.preferences?.grid?
      @clearRow()
      @activateTemplate 'grid'

  componentWillUnmount: ->
    @props.annotation.value.sort (a,b) ->
      parseFloat(a.y) - parseFloat(b.y) || parseFloat(a.x) - parseFloat(b.x)
    tempID = null
    column = 'a'
    row = 1
    for cell in @props.annotation.value
      if cell._templateID
        tempID = cell._templateID if tempID is null
        if cell._templateID == tempID
          cell.column = column
          cell.row = row
          column = String.fromCharCode(column.charCodeAt(0)+1)
        else
          row = row + 1
          tempID = cell._templateID
          cell.row = row
          cell.column = 'a'
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
      pref.preferences.savedGrids.shift()
      if pref.preferences?.savedGrids?.length > 0
        pref.update 'preferences.grid': pref.preferences.savedGrids[0].value
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

  terminate: ->
    @props.user.get('project_preferences', {project_id: @props.workflow.links.project}).then ([pref]) =>
      pref.update 'preferences': {}
      pref.save()

  saveGrid: (e) ->
    e.preventDefault()
    @activateTemplate 'grid'

    newGrid = for cell in @props.annotation.value
      Object.assign({}, cell)
    displayName = @refs.name.value
    @props.user.get('project_preferences', {project_id: @props.workflow.links.project}).then ([pref]) =>
      pref.update 'preferences.grid': newGrid
      if !pref.preferences?.savedGrids?
        pref.update 'preferences.savedGrids': [{ value: @props.annotation.value, label: displayName, id: Math.random()}]
        pref.save()
      else
        pref.preferences.savedGrids.unshift { value: @props.annotation.value, label: displayName, id: Math.random()}
        pref.save()
    @setState templateForm: false
    @setState hideDrawingTools: true

  changeGrid: (e) ->
    console.log 'your saved grids'
    console.log @props.preferences.preferences.savedGrids
    grids = @props.preferences.preferences.savedGrids
    @activateTemplate 'grid'
    selectedGrid = @preferences.savedGrids[e.target.value]
    @props.preferences.preferences.grid = selectedGrid.value
    grids.splice e.target.value, 1
    grids.unshift selectedGrid
    @props.preferences.update 'preferences'

  renderTemplateSave: ->
    <form onSubmit={@saveGrid} className="template-select">
      <input className="template-name-input" ref="name" placeholder="Template Name" /><br />
      <button type="submit" className="template-form-button">Save Template</button>
      <button type="button" className="template-form-button" onClick={@setState.bind this, templateForm: null, null}>Cancel</button>
    </form>

  renderGridSelect: ->
    <div className="template-select">
      <p>Select Saved Grid:</p>
      <select className="grid-selection-dropdown" onChange={@changeGrid}>
        {@props.preferences.preferences.savedGrids?.map (select, i) ->
          <option className='grid-dropdown-options' key={select.id} value={i}>{select.label}</option>}
      </select><br />
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
    @preferences = @props.preferences.preferences
    @annotations = @props.annotation.value
    <div>

      { @renderGridSelect() if @preferences?.grid}

      {unless @state?.hideDrawingTools
        <table className="grid-button-table">
          <tbody>

            <tr>
              <td>
                <li><button type="button" className="grid-button-tab #{('active' if !@preferences.activeTemplate) ? ''}" onClick={@activateTemplate.bind this, null} >
                    Draw Header
                </button></li>
              </td>
              <td>
                <button type="button" className="grid-button-template" disabled={!@annotations.length} onClick={@saveRow.bind this, @annotations}>
                  done
                </button>
              </td>
              <td>
                <button type="button" className="grid-button-template" title='Remove all header cells' disabled={!@annotations.length} onClick={@removeMarks.bind this, 'cell'}>
                  clear
                </button>
              </td>
            </tr>

            <tr>
              <td>
                <li><button type="button" className="grid-button-tab #{('active' if @preferences?.activeTemplate is 'row') ? ''}" disabled={!@preferences.row} onClick={@activateTemplate.bind this, 'row'} >
                    Draw Rows
                </button></li>
              </td>
              <td>
                <button type="button" className="grid-button-template" disabled={!@annotations.length or !@preferences.row} onClick={@setState.bind this, templateForm: true, null}>
                  done
                </button>
              </td>
              <td>
                <button type="button" className="grid-button-template" title='Remove all rows and/or row template' disabled={!@preferences.row} onClick={@clearRow.bind this, null}>
                  clear
                </button>
              </td>
              <td>
                <button type="button" className="grid-button-template" onClick={@terminate.bind this, null}>
                  TERMINATE!
                </button>
              </td>
            </tr>

          </tbody>
        </table>}

      { @renderTemplateSave() if @state?.templateForm }

    </div>
