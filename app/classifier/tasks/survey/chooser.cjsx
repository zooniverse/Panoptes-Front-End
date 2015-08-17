React = require 'react'
DropdownForm = require '../../../components/dropdown-form'

THUMBNAIL_BREAKPOINTS = [Infinity, 40, 20, 10, 5, 0]

module.exports = React.createClass
  displayName: 'Chooser'

  getDefaultProps: ->
    task: null
    filters: {}
    onFilter: Function.prototype
    onChoose: Function.prototype

  getFilteredChoices: ->
    for choiceID in @props.task.choicesOrder
      choice = @props.task.choices[choiceID]
      rejected = false
      for characteristicID, valueID of @props.filters
        if valueID not in choice.characteristics[characteristicID]
          rejected = true
          break
      if rejected
        continue
      else
        choiceID

  render: ->
    filteredChoices = @getFilteredChoices()

    for point in THUMBNAIL_BREAKPOINTS
      if filteredChoices.length <= point
        breakpoint = point

    <div className="survey-task-chooser">
      <div className="survey-task-chooser-characteristics">
        {for characteristicID in @props.task.characteristicsOrder
          characteristic = @props.task.characteristics[characteristicID]
          selectedValue = characteristic.values[@props.filters[characteristicID]]
          hasBeenAutoFocused = false

          <DropdownForm key={characteristicID} ref="#{characteristicID}-dropdown" className="survey-task-chooser-characteristic-menu" label={
            <span className="survey-task-chooser-characteristic" data-is-active={selectedValue? || null}>
              <span className="survey-task-chooser-characteristic-label">{selectedValue?.label ? characteristic.label}</span>
            </span>
          }>
            {for valueID in characteristic.valuesOrder
              value = characteristic.values[valueID]

              disabled = valueID is @props.filters[characteristicID]
              autoFocus = not disabled and not hasBeenAutoFocused

              if autoFocus
                hasBeenAutoFocused = true

              <span key={valueID}>
                <button type="submit" className="survey-task-chooser-characteristic-value" disabled={disabled} autoFocus={autoFocus} onClick={@handleFilter.bind this, characteristicID, valueID}>
                  {if value.image?
                    <img src={@props.task.images[value.image]} className="survey-task-chooser-characteristic-value-icon" />}
                  <div className="survey-task-chooser-characteristic-value-label">{value.label}</div>
                </button>
                {' '}
              </span>}

            &ensp;
            <button type="submit" className="survey-task-chooser-characteristic-clear-button" disabled={characteristicID not of @props.filters} autoFocus={not hasBeenAutoFocused} onClick={@handleFilter.bind this, characteristicID, undefined}>
              <i className="fa fa-ban"></i> Any
            </button>
          </DropdownForm>}
      </div>

      <div className="survey-task-chooser-choices" data-breakpoint={breakpoint}>
        {if filteredChoices.length is 0
          <div>
            <em>No matches.</em>
          </div>
        else
          for choiceID, i in filteredChoices
            choice = @props.task.choices[choiceID]
            <button key={choiceID + i} type="button" className="survey-task-chooser-choice" onClick={@props.onChoose.bind null, choiceID}>
              {unless choice.images.length is 0
                <span className="survey-task-chooser-choice-thumbnail-container">
                  <span className="survey-task-chooser-choice-thumbnail" style={backgroundImage: "url(#{@props.task.images[choice.images[0]]})"}></span>
                </span>}
              <span className="survey-task-chooser-choice-label">{choice.label}</span>
            </button>}
      </div>
      <div style={textAlign: 'center'}>
        Showing {filteredChoices.length} of {@props.task.choicesOrder.length}.
        &ensp;
        <button type="button" className="survey-task-chooser-characteristic-clear-button" disabled={Object.keys(@props.filters).length is 0} onClick={@handleClearFilters}>
          <i className="fa fa-ban"></i> Clear filters
        </button>
      </div>
    </div>

  handleFilter: (characteristicID, valueID) ->
    @props.onFilter characteristicID, valueID

  handleClearFilters: ->
    for characteristicID in @props.task.characteristicsOrder
      @props.onFilter characteristicID, undefined
