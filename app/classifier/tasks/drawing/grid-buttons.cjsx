React = require 'react'

module.exports = React.createClass
  displayName: 'GridButtons'

  activateTemplate: (type) ->
    @props.user.get('project_preferences', {project_id: @props.workflow.links.project}).then ([pref]) =>
      pref.update 'preferences.activeTemplate': type
      pref.save()

  clearTemplate: (type) ->
    @props.user.get('project_preferences', {project_id: @props.workflow.links.project}).then ([pref]) =>
      pref.update 'preferences.activeTemplate': null
      if type is 'row'
        pref.update "preferences.#{type}": null
        pref.save()
      else
        pref.preferences.savedGrids.shift()
        pref.update 'preferences.savedGrids': pref.preferences.savedGrids
        if pref.preferences?.savedGrids?.length > 0
          pref.update 'preferences.grid': pref.preferences.savedGrids[0].value
        else
          pref.update 'preferences.grid': null
        pref.save()

  saveTemplate: (marks) ->
    @props.user.get('project_preferences', {project_id: @props.workflow.links.project}).then ([pref]) =>
      if !pref.preferences.row
        pref.update 'preferences.activeTemplate': 'row'
        newArray = []
        lastCellMid = marks[marks.length - 1].y + marks[marks.length - 1].height / 2
        for cell in marks
          if cell.y < lastCellMid && (cell.y + cell.height) > lastCellMid
            newArray.push Object.assign({}, cell)
        pref.update 'preferences.row': newArray
      pref.save()

  onSubmit: (e) ->
    e.preventDefault()
    @activateTemplate 'grid'

    newArray = []
    for cell in @props.annotation.value
      newArray.push Object.assign({}, cell)
    displayName = @refs.name.value
    @props.user.get('project_preferences', {project_id: @props.workflow.links.project}).then ([pref]) =>
      pref.update 'preferences.grid': newArray
      if !pref.preferences?.savedGrids?
        pref.update 'preferences.savedGrids': [{ value: @props.annotation.value, label: displayName, id: Math.random()}]
        pref.save()
      else
        pref.preferences.savedGrids.unshift({ value: @props.annotation.value, label: displayName, id: Math.random()})
        pref.update 'preferences.savedGrids': pref.preferences.savedGrids
        pref.save()
    @setState templateForm: false

  logSomething: (e) ->
    index = e.target.value
    @props.user.get('project_preferences', {project_id: @props.workflow.links.project}).then ([pref]) =>
      movedGrid = pref.preferences.savedGrids[index]
      pref.update 'preferences.grid': movedGrid.value
      pref.preferences.savedGrids.splice index, 1
      pref.preferences.savedGrids.unshift movedGrid
      pref.update 'preferences.savedGrids': pref.preferences.savedGrids
      pref.save()

  renderedGrid: ->
    drawnGrid = false
    for mark in @props.annotation.value
      if mark.type is 'grid'
        drawnGrid = true
        break
    if drawnGrid is true and @props.preferences.preferences?.activeTemplate is 'grid'
      @activateTemplate null
    drawnGrid

  renderTemplateSave: ->
    <form onSubmit={@onSubmit} className="template-create-form">
      <input className="template-name-input" ref="name" placeholder="Template Name" /><br />
      <button type="submit" className="template-form-button">Submit</button>
      <button type="button" className="template-form-button" onClick={@setState.bind this, templateForm: null, null}>Cancel</button>
    </form>

  renderGridSelect: ->
    <div className="grid-selection">
      <p>Selected Grid:</p>
      <select className="grid-selection-dropdown" disabled={@props.preferences.preferences?.savedGrids?.length is 0} onChange={@logSomething}>
        {@props.preferences.preferences.savedGrids?.map (select, i) ->
          <option key={select.id} value={i}>{select.label}</option>}
      </select>
    </div>

  render: ->
    <div>

      <table className="grid-button-table">
        <tbody>
          <tr>
            <td>
              <li>
                <button type="button" className="grid-button-tab #{('active' if !@props.preferences.preferences?.activeTemplate) ? ''}" onClick={@activateTemplate.bind this, null} >
                  Draw Cells
                </button>
              </li>
            </td>
          </tr>

          <tr>
            <td>
              <li>
                <button type="button" className="grid-button-tab #{('active' if @props.preferences.preferences?.activeTemplate is 'row') ? ''}" disabled={!@props.preferences.preferences.row} onClick={@activateTemplate.bind this, 'row'} >
                  Draw Rows
                </button>
              </li>
            </td>
            <td>
              <button type="button" className="grid-button-template" disabled={@props.annotation.value.length is 0 or @props.preferences.preferences?.row?} title="Create Rows After Drawing Cells" onClick={@saveTemplate.bind this, @props.annotation.value}>
                create
              </button>
            </td>
            <td>
              <button type="button" className="grid-button-template" disabled={!@props.preferences.preferences?.row} title="Delete Saved Rows" onClick={@clearTemplate.bind this, 'row'}>
                delete template
              </button>
            </td>
          </tr>

          <tr>
            <td>
              <li>
                <button type="button" className="grid-button-tab #{('active' if @props.preferences.preferences?.activeTemplate is 'grid') ? ''}" disabled={!@props.preferences.preferences?.grid? or @renderedGrid()} onClick={@activateTemplate.bind this, 'grid'} >
                  Draw Grid
                </button>
              </li>
            </td>
            <td>
              <button type="button" className="grid-button-template" title="Create New Grid Based on Cells/Rows Marked" disabled={@props.annotation.value.length is 0 or !@props.preferences.preferences.row} onClick={@setState.bind this, templateForm: true, null}>
                create
              </button>
            </td>
            <td>
              <button type="button" className="grid-button-template" disabled={!@props.preferences.preferences?.grid} onClick={@clearTemplate.bind this, 'grid'}>
                delete template
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      { @renderTemplateSave() if @state?.templateForm }

      { @renderGridSelect() if @props.preferences.preferences?.grid}

    </div>
