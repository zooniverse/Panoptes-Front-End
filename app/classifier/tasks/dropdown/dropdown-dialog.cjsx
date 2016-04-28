React = require 'react'
ReactDOM = require 'react-dom'
DragReorderable = require 'drag-reorderable'
{days, months} = require './data/time'
Countries = require './data/countries' # value = ISO 3166-1 numeric code
statesUSA = require './data/statesUSA' # value = two-letter postal abbreviation, does not duplicate with Canada
provincesCanada = require './data/provincesCanada' # value = two-letter postal abbreviation, does not duplicate with USA
statesMexico = require './data/statesMexico' # value = three-letter ISO 3166-2 abbreviation
# IMPORTANT: before adding preset options, confirm values are not duplicated in existing presets

DropdownDialog = React.createClass

  getDefaultProps: ->
    selects: []
    initialSelect: {}
    related: []
    onCancel: ->
    onSave: ->

  getInitialState: ->
    editSelect: JSON.parse JSON.stringify @props.initialSelect
    optionsKeys: {}
    conditionalSelects: []
    deletedValues: []

  componentDidMount: ->
    if @props.initialSelect.condition?
      conditionalSelect = @props.selects.filter (select) => select.id is @props.initialSelect.condition
      conditionalSelects = []
      while conditionalSelect[0]?
        conditionalSelects.push conditionalSelect[0]
        conditionalSelect = @props.selects.filter (select) => select.id is conditionalSelect[0].condition
      conditionalSelects.reverse()
      @setState conditionalSelects: conditionalSelects

  handleOptionsKeys: (select, value) ->
    optionsKeys = @state.optionsKeys
    if not select.condition?
      optionsKeys[select.id] = value
    else if value is null or value is ''
      optionsKeys[select.id] = null
    else
      optionsKeys[select.id] = "#{optionsKeys[select.condition]};#{value}"
    @setState optionsKeys: optionsKeys

  getOptionsKey: (select) ->
    if not select.condition? then '*' else @state.optionsKeys[select.condition]

  getOptionsByProp: (prop) ->
    optionsByProp = @state.editSelect.options[@getOptionsKey(@state.editSelect)]?.map (option) => option[prop]
    optionsByProp or []

  editSelect: ->
    select = @state.editSelect
    select.title = @refs.title.value
    select.required = @refs.required.checked
    select.allowCreate = @refs.allowCreate.checked
    @setState editSelect: select

  onChangeConditionalAnswer: (select, e) ->
    @handleOptionsKeys(select, e.target.value)
    for select in @props.related
      @handleOptionsKeys(select, null)

  addOption: (optionLabel) ->
    if not optionLabel
      return window.alert('Please provide an option')

    if @getOptionsByProp("label")?.indexOf(optionLabel) isnt -1
      return window.alert('Options must be unique within each dropdown')

    select = @state.editSelect

    if select.condition? and not @state.optionsKeys[select.condition]
      return window.alert('Please select an answer to the related conditional dropdown(s) to associate the new option to')

    optionsKey = @getOptionsKey(select)

    if select.options[optionsKey]?
      select.options[optionsKey].push {value: "#{Math.random().toString(16).split('.')[1]}", label: "#{optionLabel}"}
    else
      select.options["#{optionsKey}"] = [{value: "#{Math.random().toString(16).split('.')[1]}", label: "#{optionLabel}"}]

    @setState editSelect: select

  onClickAddOption: ->
    @addOption(@refs.optionInput.value)
    @refs.optionInput.value = ''

  onReorder: (newOptions) ->
    select = @state.editSelect
    select.options[@getOptionsKey(select)] = newOptions
    @setState editSelect: select

  onClickDeleteOption: (value) ->
    select = @state.editSelect
    newOptions = select.options[@getOptionsKey(select)].filter (option) =>
      option.value isnt value
    select.options[@getOptionsKey(select)] = newOptions
    @setState editSelect: select

    if @props.related.length
      deletedValues = @state.deletedValues
      deletedValues.push value
      @setState deletedValues: deletedValues

  handlePreset: ->
    select = @state.editSelect

    if select.condition? and not @state.optionsKeys[select.condition]
      return window.alert('Please select an answer to the related conditional dropdown(s) to associate the new option to')

    optionsKey = @getOptionsKey(select)
    preset = @refs.preset.value

    switch preset
      when "days" then select.options["#{optionsKey}"] = days
      when "months" then select.options["#{optionsKey}"] = months
      when "Countries" then select.options["#{optionsKey}"] = Countries
      when "statesUSA" then select.options["#{optionsKey}"] = statesUSA
      when "provincesCanada" then select.options["#{optionsKey}"] = provincesCanada
      when "statesMexico" then select.options["#{optionsKey}"] = statesMexico
      else return

    @setState editSelect: select
    @refs.preset.value = ""

  save: (e) ->
    if not @state.editSelect.title
      return window.alert('Dropdowns must have a Title.')

    selectTitles = @props.selects
      .filter (select) => select isnt @props.initialSelect
      .map (select) -> select.title

    if selectTitles.indexOf(@state.editSelect.title) isnt -1
      return window.alert('Dropdowns must have a unique Title.')

    newData = {editSelect: @state.editSelect, deletedValues: @state.deletedValues}

    @props.onSave(newData)

  cancel: ->
    @props.onCancel()

  renderOption: (option) ->
    <li key={option.value}>
      <span><i className="fa fa-bars" />{' '}</span>
      {option.label}{' '}
      <button onClick={@onClickDeleteOption.bind(@, option.value)} title="Delete">
        <i className="fa fa-close" />
      </button>
    </li>

  render: ->
    select = @state.editSelect
    <div className="dropdown-editor">
      <p>
        <label>
          <span className="form-label">Title</span>
          <br />
          <input className="standard-input full" type="text" ref="title" defaultValue={select.title} onChange={@editSelect} autoFocus></input>
        </label>
        {if select.condition?
          <span>Dependent on {@state.conditionalSelects[@state.conditionalSelects.length - 1]?.title}</span>}
      </p>

      <label className="pill-button">
        Required <input type="checkbox" ref="required" checked={select.required} onChange={@editSelect}></input>
      </label>{' '}
      <label className="pill-button">
        Allow Create <input type="checkbox" ref="allowCreate" checked={select.allowCreate} onChange={@editSelect}></input>
      </label>
      <br />

      {if select.condition?
        <div>
          <br />
          <h2 className="form-label">Options For</h2>
          {@state.conditionalSelects.map (condition) =>
            <div key={condition.id}>
              <select onChange={@onChangeConditionalAnswer.bind(@, condition)}>
                <option value="">none selected</option>
                {condition.options[@getOptionsKey(condition)]?.map (option) =>
                  <option key={option.value} value={option.value} label={option.label}></option>}
              </select>
            </div>
          }
          <br />
        </div>
      else
        <div>
          <br />
          <h2 className="form-label">Options</h2>
        </div>
      }

      <div>
        <DragReorderable
          tag="ul"
          className="dropdown-options-list"
          items={select.options[@getOptionsKey(select)]}
          render={@renderOption}
          onChange={@onReorder}
        />

        <input ref="optionInput"></input>{' '}
        <button type="button" onClick={@onClickAddOption}><i className="fa fa-plus"/> Add Option</button>
      </div>

      <br />

      <div>
        <h2 className="form-label">Presets</h2>
        <select ref="preset">
          <option value="">none selected</option>
          <option value="days">Days</option>
          <option value="months">Months</option>
          <option value="Countries">Countries</option>
          <option value="statesUSA">States - United States</option>
          <option value="provincesCanada">Provinces - Canada</option>
          <option value="statesMexico">States - Mexico</option>
        </select>
        <button onClick={@handlePreset}>Apply</button>
      </div>

      <br />

      <p>
        <label>
          <button type="button" className="minor-button" onClick={@cancel}>Cancel</button>
        </label>{' '}
        <label>
          <button type="button" className="major-button" onClick={@save}>Save</button>
        </label>{' '}
      </p>
    </div>

module.exports = DropdownDialog
