React = require 'react'
TriggeredModalForm = require 'modal-form/triggered'

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

    <div className="flexible-survey survey-task-chooser">
      <div className="survey-task-chooser-characteristics">
        {for characteristicID in @props.task.characteristicsOrder
          characteristic = @props.task.characteristics[characteristicID]
          selectedValue = characteristic.values[@props.filters[characteristicID]]
          hasBeenAutoFocused = false

          <TriggeredModalForm key={characteristicID} ref="#{characteristicID}-dropdown" className="survey-task-chooser-characteristic-menu" trigger={
            <span className="survey-task-chooser-characteristic" data-is-active={selectedValue? || null}>
              <span className="survey-task-chooser-characteristic-label">{selectedValue?.label ? characteristic.label}</span>
            </span>
          }>
            <div className="survey-task-chooser-characteristic-menu-container">
              {for valueID in characteristic.valuesOrder
                value = characteristic.values[valueID]

                disabled = valueID is @props.filters[characteristicID]
                autoFocus = not disabled and not hasBeenAutoFocused
                selected = valueID is @props.filters[characteristicID]

                if autoFocus
                  hasBeenAutoFocused = true

                <button key={valueID} type="submit" title={value.label} className="survey-task-chooser-characteristic-value" disabled={disabled} data-selected={selected} autoFocus={autoFocus} onClick={@handleFilter.bind this, characteristicID, valueID}>
                  {if value.image?
                    <img src={@props.task.images[value.image]} alt={value.label} className="survey-task-chooser-characteristic-value-icon" />}
                </button>}

              <button type="submit" className="survey-task-chooser-characteristic-clear-button" disabled={characteristicID not of @props.filters} autoFocus={not hasBeenAutoFocused} onClick={@handleFilter.bind this, characteristicID, undefined}>
                Clear
              </button>
            </div>
            <div className="survey-task-chooser-characteristic-value-label">
            {label = ""
            for valueID in characteristic.valuesOrder
              value = characteristic.values[valueID]

              if valueID is @props.filters[characteristicID]
                label = value.label
            if label then label else "Make a selection"
            }</div>
          </TriggeredModalForm>}
      </div>

      <div className="flex-survey-task-chooser-choices" data-breakpoint={breakpoint}>
        {if filteredChoices.length is 0
          <div>
            <em>No matches.</em>
          </div>
        else
          for choiceID, i in filteredChoices
            choice = @props.task.choices[choiceID]
            <button key={choiceID + i} type="button" className="flex-survey-task-chooser-choice" onClick={@props.onChoose.bind null, choiceID}>
              {unless choice.images.length is 0
                <span className="survey-task-chooser-choice-thumbnail-container">
                  <img src={@props.task.images[choice.images[0]]} alt={choice.label} className="survey-task-chooser-choice-thumbnail" />
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
