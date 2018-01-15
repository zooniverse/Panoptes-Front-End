React = require 'react'
createReactClass = require 'create-react-class'
Select = require('react-select').default

module.exports = createReactClass
  displayName: 'GridButtons'

  getDefaultProps: ->
    preferences: null
  
  getInitialState: ->
    value: ''

  componentWillMount: ->
    value = @props.preferences.preferences.savedGrids?[@props.preferences.preferences.savedGrids.length - 1]?.label
    @setState {value}
    if @props.preferences?.preferences?.grid?
      @clearRow()
      @activateTemplate 'grid'
      

  activateTemplate: (type) ->
    @props.preferences.preferences.activeTemplate = type
    @props.preferences.update 'preferences'
    if type is 'grid'
      @setState gridSelect: true, templateForm: null, error: null
    if type is null
      @setState gridSelect: false

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
    @props.preferences.preferences.savedGrids.pop()
    prefs = @props.preferences.preferences
    if prefs.savedGrids?.length > 0
      @activateTemplate 'grid'
      prefs.grid = prefs.savedGrids[prefs.savedGrids.length - 1].template
    else
      prefs.grid = null
      @activateTemplate null
      @setState gridSelect: false
    @props.preferences.save()

  saveRow: (marks) ->
    @activateTemplate 'row'
    lastCellMidpoint = marks[marks.length - 1].y + marks[marks.length - 1].height / 2
    savedRow = []
    for cell in marks
      if cell.y < lastCellMidpoint && (cell.y + cell.height) > lastCellMidpoint
        savedRow.push Object.assign({}, cell)
    @props.preferences.preferences.row = savedRow
    @props.preferences.update 'preferences'
    @forceUpdate()

  saveGrid: (e) ->
    e.preventDefault()
    if @uniqueName @refs.name.value
      prefs = @props.preferences.preferences
      @props.annotation._completed = true
      @activateTemplate 'grid'

      newGrid = for cell in @props.annotation.value
        Object.assign({}, cell)
      displayName = @refs.name.value
      prefs.grid = newGrid
      if !prefs.savedGrids
        prefs.savedGrids = [{ value: Math.random(), label: displayName, template: newGrid}]
      else
        prefs.savedGrids.push { value: Math.random(), label: displayName, template: newGrid}
      @props.preferences.save()
      @setState templateForm: false, gridSelect: true
      @setState error: null if @state?.error
      value = displayName
      @setState {value}

  uniqueName: (name) ->
    unique = true
    @props.preferences.preferences?.savedGrids?.map (template) ->
      unique = false if template.label == name
    @setState error: true if unique is false
    unique

  renderTemplateSave: ->
    <form onSubmit={@saveGrid}>
      {if @state.error
        <div className="form-help error">
          <span>Template Name Should be Unique</span>
        </div>}
      <input className="template-name-input" ref="name" placeholder="Template Name" /><br />
      <button type="submit" className="template-form-button">Save Template</button>
      <button type="button" className="template-form-button" onClick={@setState.bind this, templateForm: null, null}>Cancel</button>
    </form>

  changeGrid: (option) ->
    @activateTemplate 'grid'
    @props.preferences.preferences.savedGrids.map (grid, index) =>
      if grid.value is option.value
        @props.preferences.preferences.grid = grid.template
        @props.preferences.preferences.savedGrids.splice index, 1
        @props.preferences.preferences.savedGrids.push grid
        @props.preferences.update 'preferences'
        value = grid.label
        @setState {value}

  renderGridSelect: ->
    <div>
      <p>Select Saved Grid:</p>
      <Select
        className='grid-selection-dropdown'
        clearable={false}
        onChange={@changeGrid}
        options={@props.preferences.preferences.savedGrids}
        scrollMenuIntoView={true}
        searchable={false}
        value={label: @state.value, value: @state.value}
      />
      <button type="button" className="template-form-button" onClick={@deleteGrid.bind this, null}>
        delete template
      </button>
      <p> or </p>
      <button type="button" className="template-form-button create-grid" onClick={@activateTemplate.bind this, null}>
        create new grid
      </button>
    </div>

  render: ->
    @preferences = @props.preferences?.preferences
    @annotations = @props.annotation.value
    <div className="template-select">

      { @renderGridSelect() if @state?.gridSelect }

      { if @preferences?.grid and !@state?.gridSelect
        <button type="button" className="template-form-button" onClick={@activateTemplate.bind this, 'grid'}>
          cancel new grid
        </button>}

      {unless @state?.gridSelect
        <table className="grid-button-table">
          <tbody>

            <tr>
              <td><li><button type="button" className="grid-button-tab #{('active' if !@preferences?.activeTemplate) ? ''}" onClick={@activateTemplate.bind this, null} > Draw Header </button></li></td>
              <td><button type="button" className="grid-button-template" disabled={!@annotations.length} onClick={@saveRow.bind this, @annotations}> done </button></td>
              <td><button type="button" className="grid-button-template" title='Remove all header cells' disabled={!@annotations.length} onClick={@removeMarks.bind this, 'cell'}> clear </button></td>
            </tr>

            <tr>
              <td><li><button type="button" className="grid-button-tab #{('active' if @preferences?.activeTemplate is 'row') ? ''}" disabled={!@preferences?.row} onClick={@activateTemplate.bind this, 'row'} > Draw Rows </button></li></td>
              <td><button type="button" className="grid-button-template" disabled={!@annotations.length or !@preferences?.row} onClick={@setState.bind this, templateForm: true, null}> done </button></td>
              <td><button type="button" className="grid-button-template" title='Remove all rows and/or row template' disabled={!@preferences?.row} onClick={@clearRow.bind this, null}> clear </button></td>
            </tr>

          </tbody>
        </table>}

        { @renderTemplateSave() if @state?.templateForm }

    </div>
