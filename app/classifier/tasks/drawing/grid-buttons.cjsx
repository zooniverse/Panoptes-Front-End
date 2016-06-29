React = require 'react'

module.exports = React.createClass
  displayName: 'GridButtons'

  componentWillMount: ->
    if @props.preferences.preferences?.grid?
      @activateTemplate 'grid'

  activateTemplate: (type) ->
    @props.user.get('project_preferences', {project_id: @props.workflow.links.project}).then ([pref]) =>
      pref.update 'preferences.activeTemplate': type
      pref.save()
      if type is 'grid'
        @setState hideDrawingTools: true
      if type is null
        @setState hideDrawingTools: false

  clearTemplate: (type) ->
    @props.user.get('project_preferences', {project_id: @props.workflow.links.project}).then ([pref]) =>
      pref.update 'preferences.activeTemplate': null
      if type is 'row'
        pref.update "preferences.#{type}": null
      else
        pref.preferences.savedGrids.shift()
        pref.update 'preferences.savedGrids': pref.preferences.savedGrids
        if pref.preferences?.savedGrids?.length > 0
          @activateTemplate 'grid'
          pref.update 'preferences.grid': pref.preferences.savedGrids[0].value
        else
          pref.update 'preferences.grid': null
          @setState hideDrawingTools: false
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
    @props.user.get('project_preferences', {project_id: @props.workflow.links.project}).then ([pref]) =>
      movedGrid = pref.preferences.savedGrids[index]
      pref.update 'preferences.grid': movedGrid.value
      pref.preferences.savedGrids.splice index, 1
      pref.preferences.savedGrids.unshift movedGrid
      pref.save()

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
      <button type="button" className="template-form-button" onClick={@clearTemplate.bind this, 'grid'}>
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
    pref = @props.preferences.preferences

    <div>

      { @renderGridSelect() if pref?.grid}

      {unless @state?.hideDrawingTools
        <table className="grid-button-table">
          <tbody>
            <tr>
              <td>
                <li>
                  <button type="button" className="grid-button-tab #{('active' if !pref.activeTemplate) ? ''}" onClick={@activateTemplate.bind this, null} >
                    Draw Header
                  </button>
                </li>
              </td>
              <td>
                <button type="button" className="grid-button-template" disabled={!@props.annotation.value.length or pref.row?} onClick={@saveTemplate.bind this, @props.annotation.value}>
                  done
                </button>
              </td>
            </tr>

            <tr>
              <td>
                <li>
                  <button type="button" className="grid-button-tab #{('active' if pref?.activeTemplate is 'row') ? ''}" disabled={!pref.row} onClick={@activateTemplate.bind this, 'row'} >
                    Draw Rows
                  </button>
                </li>
              </td>
              <td>
                <button type="button" className="grid-button-template" disabled={!@props.annotation.value.length or !pref.row} onClick={@setState.bind this, templateForm: true, null}>
                  done
                </button>
              </td>
              <td>
                <button type="button" className="grid-button-template" disabled={!pref.row} onClick={@clearTemplate.bind this, 'row'}>
                  clear
                </button>
              </td>
            </tr>
          </tbody>
        </table>}

      { @renderTemplateSave() if @state?.templateForm }

    </div>
