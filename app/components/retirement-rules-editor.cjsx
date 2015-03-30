React = require 'react'

module.exports = React.createClass
  displayName: 'RetirementRulesEditor'

  getDefaultProps: ->
    subjectSet: null

  getInitialState: ->
    saveError: null
    saveInProgress: false

  defaultCriteria: 'classification_count'

  defaultOptions:
    classification_count: count: 15

  render: ->
    criteria = @props.subjectSet.retirement?.criteria ? @defaultCriteria
    options = @props.subjectSet.retirement?.options ? @defaultOptions[criteria]

    <span className="retirement-rules-editor">
      <select ref="criteriaSelect" value={criteria} disabled onChange={@handleChangeCriteria}>
        <option value="classification_count">Classification count</option>
      </select>{' '}

      {switch criteria
        when 'classification_count'
          <input type="number" name="count" value={options.count} min="1" max="100" step="1" onChange={@handleChangeOption} />
        else}
    </span>

  handleChangeCriteria: (e) ->
    @props.subjectSet.update
      'retirement.criteria': e.target.value
      'retirement.options': @defaultOptions[e.target.value]

  handleChangeOption: (e) ->
    @props.subjectSet.update
      'retirement.criteria': @props.subjectSet.retirement?.criteria ? @defaultCriteria

    @props.subjectSet.update
      'retirement.options': @props.subjectSet.retirement.options ? @defaultOptions[@props.subjectSet.retirement.criteria]

    updateKey = "retirement.options.#{e.target.name}"
    newOptionsData = {}
    newOptionsData[updateKey] = if e.target.type is 'number'
      parseFloat e.target.value
    else
      e.target.value

    @props.subjectSet.update newOptionsData
