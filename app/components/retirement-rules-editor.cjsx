React = require 'react'
createReactClass = require 'create-react-class'
ChangeListener = require './change-listener'

module.exports = createReactClass
  displayName: 'RetirementRulesEditor'

  getDefaultProps: ->
    workflow: null

  getInitialState: ->
    saveError: null
    saveInProgress: false

  defaultCriteria: 'classification_count'

  defaultOptions:
    classification_count: count: 15

  render: ->
    <ChangeListener target={@props.workflow}>{ =>
      criteria = @props.workflow.retirement?.criteria ? @defaultCriteria
      options = @props.workflow.retirement?.options ? @defaultOptions[criteria]

      <span className="retirement-rules-editor">
        <select ref="criteriaSelect" value={criteria} disabled onChange={@handleChangeCriteria}>
          <option value="classification_count">Classification count</option>
        </select>{' '}

        {switch criteria
          when 'classification_count'
            <input type="number" name="count" value={options.count} min="1" max="100" step="1" onChange={@handleChangeOption} />
          else}
      </span>
    }</ChangeListener>

  handleChangeCriteria: (e) ->
    @props.workflow.update
      'retirement.criteria': e.target.value
      'retirement.options': @defaultOptions[e.target.value]

  handleChangeOption: (e) ->
    @props.workflow.update
      'retirement.criteria': @props.workflow.retirement?.criteria ? @defaultCriteria

    @props.workflow.update
      'retirement.options': @props.workflow.retirement.options ? @defaultOptions[@props.workflow.retirement.criteria]

    updateKey = "retirement.options.#{e.target.name}"
    newOptionsData = {}
    newOptionsData[updateKey] = if e.target.type is 'number'
      parseFloat e.target.value
    else
      e.target.value

    @props.workflow.update newOptionsData
