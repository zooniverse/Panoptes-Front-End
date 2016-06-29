React = require 'react'

module.exports = React.createClass
  displayName: 'GridButtons'

  componentWillMount: ->
    @preferences = @props.preferences.preferences
    if @props.preferences.preferences?.grid?
      @activateTemplate 'grid'

  activateTemplate: (type) ->
    @preferences.activeTemplate = type
    @props.preferences.update 'preferences'
    if type is 'grid'
      @setState hideDrawingTools: true
    if type is null
      @setState hideDrawingTools: false

  clearRow: (type) ->
    @preferences.activeTemplate = null
    @preferences.row = null
    @props.preferences.update 'preferences'

  deleteGrid: ->
    @props.user.get('project_preferences', {project_id: @props.workflow.links.project}).then ([pref]) =>
      pref.preferences.savedGrids.shift()
      if pref.preferences?.savedGrids?.length > 0
        pref.update 'preferences.grid': pref.preferences.savedGrids[0].value
      else
        pref.update 'preferences.grid': null
        @setState hideDrawingTools: false
      pref.save()

  saveRow: (marks) ->
    if !@preferences.row
      @preferences.activeTemplate = 'row'
      newArray = []
      lastCellMid = marks[marks.length - 1].y + marks[marks.length - 1].height / 2
      for cell in marks
        if cell.y < lastCellMid && (cell.y + cell.height) > lastCellMid
          newArray.push Object.assign({}, cell)
      @preferences.row = newArray
    @props.preferences.update 'preferences'

  onSubmit: (e) ->
    e.preventDefault()
    @activateTemplate 'grid'

    newArray = for cell in @props.annotation.value
      Object.assign({}, cell)
    displayName = @refs.name.value
    @props.user.get('project_preferences', {project_id: @props.workflow.links.project}).then ([pref]) =>
      pref.update 'preferences.grid': newArray
      if !pref.preferences?.savedGrids?
        pref.update 'preferences.savedGrids': [{ value: @props.annotation.value, label: displayName, id: Math.random()}]
        pref.save()
      else
        pref.preferences.savedGrids.unshift { value: @props.annotation.value, label: displayName, id: Math.random()}
        pref.save()
    @setState templateForm: false
    @setState hideDrawingTools: true

  changeGrid: (e) ->
    @activateTemplate 'grid'
    index = e.target.value
    movedGrid = @preferences.savedGrids[index]
    @preferences.grid = movedGrid.value
    @preferences.savedGrids.splice index, 1
    @preferences.savedGrids.unshift movedGrid
    @props.preferences.update 'preferences'

  renderTemplateSave: ->
    <form onSubmit={@onSubmit} className="template-select">
      <input className="template-name-input" ref="name" placeholder="Template Name" /><br />
      <button type="submit" className="template-form-button">Save Template</button>
      <button type="button" className="template-form-button" onClick={@setState.bind this, templateForm: null, null}>Cancel</button>
    </form>

  renderGridSelect: ->
    <div className="template-select">
      <p>Select Saved Grid:</p>
      <select className="grid-selection-dropdown" onChange={@changeGrid}>
        {@props.preferences.preferences.savedGrids?.map (select, i) ->
          <option key={select.id} value={i}>{select.label}</option>}
      </select><br />
      <button type="button" className="template-form-button" onClick={@deleteGrid.bind this, null}>
        delete template
      </button><br /><br />
      <button type="button" className="new-grid-button" onClick={@activateTemplate.bind this, null}>
        create new grid
      </button>
      <button type="button" className="template-form-button" onClick={@activateTemplate.bind this, 'grid'}>
        cancel
      </button>
    </div>

  render: ->
    <div>

      { @renderGridSelect() if @preferences?.grid}

      {unless @state?.hideDrawingTools
        <table className="grid-button-table">
          <tbody>
            <tr>
              <td>
                <li>
                  <button type="button" className="grid-button-tab #{('active' if !@preferences.activeTemplate) ? ''}" onClick={@activateTemplate.bind this, null} >
                    Draw Header
                  </button>
                </li>
              </td>
              <td>
                <button type="button" className="grid-button-template" disabled={!@props.annotation.value.length or @preferences.row?} onClick={@saveRow.bind this, @props.annotation.value}>
                  done
                </button>
              </td>
            </tr>

            <tr>
              <td>
                <li>
                  <button type="button" className="grid-button-tab #{('active' if @preferences?.activeTemplate is 'row') ? ''}" disabled={!@preferences.row} onClick={@activateTemplate.bind this, 'row'} >
                    Draw Rows
                  </button>
                </li>
              </td>
              <td>
                <button type="button" className="grid-button-template" disabled={!@props.annotation.value.length or !@preferences.row} onClick={@setState.bind this, templateForm: true, null}>
                  done
                </button>
              </td>
              <td>
                <button type="button" className="grid-button-template" disabled={!@preferences.row} onClick={@clearRow.bind this, null}>
                  clear
                </button>
              </td>
            </tr>
          </tbody>
        </table>}

      { @renderTemplateSave() if @state?.templateForm }

    </div>
