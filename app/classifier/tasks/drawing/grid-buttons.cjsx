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
        if pref.preferences.savedGrids.length > 0
          pref.update 'preferences.grid': pref.preferences.savedGrids[0].value
        else
          pref.update 'preferences.grid': null
        pref.save()

  saveTemplate: (marks, type) ->
    @props.user.get('project_preferences', {project_id: @props.workflow.links.project}).then ([pref]) =>
      pref.update 'preferences.activeTemplate': type
      if pref.preferences.grid and type is 'grid'
        @setState templateForm: true
        pref.update 'preferences.grid': marks
        pref.save()
      if !pref.preferences.grid and type is 'grid'
        @setState templateForm: true
        pref.update 'preferences.grid': marks
        pref.save()
      else if !pref.preferences.row and type is 'row'
        newArray = []
        lastCellMid = marks[marks.length - 1].y + marks[marks.length - 1].height / 2
        for cell in marks
          if cell.y < lastCellMid && (cell.y + cell.height) > lastCellMid
            newArray.push Object.assign({}, cell)
        pref.update 'preferences.row': newArray
      pref.save()

  onSubmit: (e) ->
    e.preventDefault()

    displayName = @refs.name.value
    @props.user.get('project_preferences', {project_id: @props.workflow.links.project}).then ([pref]) =>
      pref.update 'preferences.grid': marks
      pref.save()
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

  renderTemplateSave: ->
    <form onSubmit={@onSubmit} className="collections-create-form">
      <input className="collection-name-input" ref="name" placeholder="Template Name" />
      <button type="button" className="minor-button">Submit</button>
      <button type="button" className="minor-button">Cancel</button>
    </form>

  renderGridSelect: ->
    <div>
      <p>Selected Grid:</p>
      <select disabled={@props.preferences.preferences?.savedGrids.length is 0} onChange={@logSomething}>
        {@props.preferences.preferences.savedGrids?.map (select, i) ->
          <option key={select.id} value={i}>{select.label}</option>}
      </select>
    </div>

  render: ->
    <div>

      <button type="button" className="tabbed-content-tab #{('active' if !@props.preferences.preferences?.activeTemplate) ? ''}" onClick={@activateTemplate.bind this, null} >
        Draw Cells
      </button><br />

      <button type="button" className="tabbed-content-tab #{('active' if @props.preferences.preferences?.activeTemplate is 'row') ? ''}" disabled={!@props.preferences.preferences.row} onClick={@activateTemplate.bind this, 'row'} >
        Draw Rows
      </button>
      <button type="button" disabled={@props.annotation.value.length is 0 or @props.preferences.preferences?.row?} title="Create Rows After Drawing Cells" onClick={@saveTemplate.bind this, @props.annotation.value, 'row'}>
        Create Rows
      </button>
      <button type="button" disabled={!@props.preferences.preferences?.row} title="Delete Saved Rows" onClick={@clearTemplate.bind this, 'row'}>
        Clear Row Template
      </button><br />

      <button type="button" className="tabbed-content-tab #{('active' if @props.preferences.preferences?.activeTemplate is 'grid') ? ''}" disabled={!@props.preferences.preferences?.grid?} onClick={@activateTemplate.bind this, 'grid'} >
        Draw Grid
      </button>
      <button type="button" title="Create New Grid Based on Cells/Rows Marked" disabled={@props.annotation.value.length is 0 or !@props.preferences.preferences.row} onClick={@saveTemplate.bind this, @props.annotation.value, 'grid'}>
        Create New Grid Template
      </button>
      <button type="button" disabled={!@props.preferences.preferences?.grid} onClick={@clearTemplate.bind this, 'grid'}>
        Delete Selected Grid Template
      </button><br />

      { @renderTemplateSave() if @state?.templateForm }

      { @renderGridSelect() if @props.preferences.preferences?.grid}

    </div>
