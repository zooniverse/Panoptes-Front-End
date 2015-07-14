React = require 'react'

LOOKS_LIKE = 'Looks like'

Summary = React.createClass
  displayName: 'SurveySummary'
  render: ->
    null

module.exports = React.createClass
  displayName: 'SurveyTask'

  statics:
    Editor: null
    Summary: Summary

    getDefaultTask: ->
      type: 'survey'
      characteristics: []
      choices: []

    getTaskText: (task) ->
      '(Survey)'

    getDefaultAnnotation: ->
      value: []

  getDefaultProps: ->
    task: null
    annotation: null
    onChange: Function.prototype

  getInitialState: ->
    filters: {}
    visibleChoices: @props.task.choices

  getFilteredChoices: ->
    for choiceID in @props.task.choicesOrder
      choice = @props.task.choices[choiceID]
      rejected = false
      for filterID, filterValue of @state.filters
        if filterValue not in choice.characteristics[filterID]
          rejected = true
          break
      if rejected
        continue
      else
        choiceID

  render: ->
    <div className="survey-task">
      {for characteristicID in @props.task.characteristicsOrder
        characteristic = @props.task.characteristics[characteristicID]
        <div key={characteristicID}>
          <label>
            {characteristic.label}
            <select value={@state.filters[characteristicID] ? ''} onChange={@handleFilter.bind this, characteristicID}>
              <option value="">(Any)</option>
              {for valueID in characteristic.valuesOrder
                value = characteristic.values[valueID]
                <option value={valueID}>{value.label}</option>}
            </select>
          </label>
        </div>}

      {for choiceID in @getFilteredChoices()
        choice = @props.task.choices[choiceID]
        <div key={choiceID}>
          <button onClick={@handleChoice.bind this, choiceID}>{choice.label}</button>
        </div>}
    </div>

  handleFilter: (characteristicID, e) ->
    value = e.target.value
    if e.target.value is ''
      delete @state.filters[characteristicID]
    else
      @state.filters[characteristicID] = value
    @forceUpdate()
    console.log 'Filter', @state.filters

  handleChoice: (choiceID) ->
    console.log 'Show details for', choiceID
