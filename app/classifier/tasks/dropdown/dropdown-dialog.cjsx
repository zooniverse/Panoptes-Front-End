React = require 'react'
createReactClass = require 'create-react-class'
DragReorderable = require 'drag-reorderable'
TriggeredModalForm = require 'modal-form/triggered'
dropdownEditorHelp = require('./editor-help').default
months = require './presets/months'
countries = require './presets/countries' # value = ISO 3166-1 numeric code
statesUSA = require './presets/states-USA' # value = two-letter postal abbreviation, does not duplicate with Canada
provincesCanada = require './presets/provinces-Canada' # value = two-letter postal abbreviation, does not duplicate with USA
statesMexico = require './presets/states-Mexico' # value = three-letter ISO 3166-2 abbreviation
# IMPORTANT: before adding preset options, confirm values are not duplicated in existing presets

DropdownDialog = createReactClass

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
    presetValue: ""

  componentDidMount: ->
    if @props.initialSelect.condition?
      conditionalSelect = @props.selects.filter (select) => select.id is @props.initialSelect.condition
      conditionalSelects = []
      while conditionalSelect[0]?
        conditionalSelects.push conditionalSelect[0]
        conditionalSelect = @props.selects.filter (select) => select.id is conditionalSelect[0].condition
      conditionalSelects.reverse()
      @setState conditionalSelects: conditionalSelects
      optionsKeys = {}
      for select in conditionalSelects
        optionsKeys[select.id] = null
      @setState optionsKeys: optionsKeys

  handleOptionsKeys: (select, value) ->
    optionsKeys = @state.optionsKeys
    if value is null or value is ""
      optionsKeys[select.id] = null
    else if not select.condition?
      optionsKeys[select.id] = value
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

  onChangeConditionalAnswer: (select, index, e) ->
    @handleOptionsKeys(select, e.target.value)
    if @state.conditionalSelects.length and index isnt (@state.conditionalSelects.length - 1)
      for otherIndex in [(index + 1)..(@state.conditionalSelects.length - 1)]
        @handleOptionsKeys(@state.conditionalSelects[otherIndex], null)

  addOption: (optionLabel) ->
    if not optionLabel
      return

    select = @state.editSelect
    optionsKey = @getOptionsKey(select)

    if @getOptionsByProp("label")?.indexOf(optionLabel) isnt -1
      dupIndex = @getOptionsByProp("label")?.indexOf(optionLabel)
      select.options[optionsKey]?.splice(dupIndex, 1)

    if select.options[optionsKey]?
      select.options[optionsKey].push {value: "#{Math.random().toString(16).split('.')[1]}", label: "#{optionLabel}"}
    else
      select.options["#{optionsKey}"] = [{value: "#{Math.random().toString(16).split('.')[1]}", label: "#{optionLabel}"}]

    @setState editSelect: select

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

  handlePresetChange: (e) ->
    @setState presetValue: e.target.value

  handlePresetApply: ->
    select = @state.editSelect
    optionsKey = @getOptionsKey(select)
    preset = @state.presetValue

    switch preset
      when "numberRange" then @handleNumberRange(select, optionsKey)
      when "months" then select.options["#{optionsKey}"] = months
      when "Countries" then select.options["#{optionsKey}"] = countries
      when "statesUSA" then select.options["#{optionsKey}"] = statesUSA
      when "provincesCanada" then select.options["#{optionsKey}"] = provincesCanada
      when "statesMexico" then select.options["#{optionsKey}"] = statesMexico
      else return

    @setState editSelect: select
    @setState presetValue: ""

  handleNumberRange: (select, optionsKey) ->
    topNumber = parseFloat @refs.topNumber.value
    bottomNumber = parseFloat @refs.bottomNumber.value

    options = []
    for num in [topNumber..bottomNumber]
      options.push {value: num, label: "#{num}"}

    select.options["#{optionsKey}"] = options

    return select

  handleAdd: ->
    optionsArray = @refs.optionInput.value.split(/\n/)

    for option in optionsArray
      @addOption option

    @refs.optionInput.value = ""

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

  checkConditions: ->
    if @props.initialSelect.condition?
      disable = Object.keys(@state.optionsKeys).some (key) =>
        @state.optionsKeys[key] is null
      return disable
    return false

  renderOption: (option) ->
    <li key={option.value}>
      <span><i className="fa fa-bars" />{' '}</span>
      {option.label}{' '}
      <button onClick={@onClickDeleteOption.bind(@, option.value)} title="Delete">
        <i className="fa fa-close" />
      </button>
    </li>

  render: ->
    disabledStyle =
      opacity: 0.4
      pointerEvents: 'none'

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

      <label className="pill-button" title={dropdownEditorHelp.required}>
        Required <input type="checkbox" ref="required" checked={select.required} onChange={@editSelect}></input>
      </label>{' '}
      <label className="pill-button" title={dropdownEditorHelp.allowCreate}>
        Allow Create <input type="checkbox" ref="allowCreate" checked={select.allowCreate} onChange={@editSelect}></input>
      </label>
      <br />

      {if select.condition?
        <div>
          <br />
          <h2 className="form-label">Options For</h2>
          {@state.conditionalSelects.map (condition, index) =>
            <div key={condition.id}>
              <select onChange={@onChangeConditionalAnswer.bind(@, condition, index)}>
                <option value="">none selected</option>
                {condition.options[@getOptionsKey(condition)]?.map (option) =>
                  <option key={option.value} value={option.value}>{option.label}</option>}
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
      </div>

      <div>
        <p>
          <span className="form-label">Add Option(s){' '}</span>
          <TriggeredModalForm className="dropdown-help" trigger={
            <span className="secret-button">
              <i className="fa fa-question-circle"></i>
            </span>
          }>{dropdownEditorHelp.options}
          </TriggeredModalForm>
        </p>
        {if @checkConditions()
          <p className="form-help warning">Please select Options For above</p>}
        <div style={disabledStyle if @checkConditions()}>
          <textarea ref="optionInput"/>
          <br />
          <button type="button" onClick={@handleAdd}><i className="fa fa-plus"/> Add</button>
        </div>
      </div>

      <br />

      <div style={disabledStyle if @checkConditions()}>
        <h2 className="form-label">Presets</h2>
        <select value={@state.presetValue} onChange={@handlePresetChange}>
          <option value="">none selected</option>
          <option value="numberRange">Range of Numbers (i.e. Days, Years)</option>
          <option value="months">Months</option>
          <option value="Countries">Countries</option>
          <option value="statesUSA">States - United States</option>
          <option value="provincesCanada">Provinces - Canada</option>
          <option value="statesMexico">States - Mexico</option>
        </select>

        {if @state.presetValue is "numberRange"
          <div>
            <label>Top number:
              <input type="number" ref="topNumber" />
            </label>
            <br />
            <label>Bottom number:
              <input type="number" ref="bottomNumber" />
            </label>
          </div>}

        <button onClick={@handlePresetApply}>Apply</button>
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
