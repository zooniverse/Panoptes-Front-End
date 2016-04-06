React = require 'react'
TriggeredModalForm = require 'modal-form/triggered'
sortIntoColumns = require 'sort-into-columns'

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

  whatSizeThumbnails: ({length}) ->
    if length <= 5
      'large'
    else if length <= 10
      'medium'
    else if length <= 20
      'small'
    else
      'none'

  howManyColumns: ({length}) ->
    if length <= 5
      1
    else if length <= 20
      2
    else
      3

  render: ->
    filteredChoices = @getFilteredChoices()

    thumbnailSize = @whatSizeThumbnails filteredChoices

    columnsCount = @howManyColumns filteredChoices
    sortedFilteredChoices = sortIntoColumns filteredChoices, columnsCount

    <div className="survey-task-chooser">
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

      <div className="survey-task-chooser-choices" data-thumbnail-size={thumbnailSize} data-columns={columnsCount}>
        {if sortedFilteredChoices.length is 0
          <div>
            <em>No matches.</em>
          </div>
        else
          for choiceID, i in sortedFilteredChoices
            choice = @props.task.choices[choiceID]
            <button key={choiceID + i} type="button" className="survey-task-chooser-choice" onClick={@props.onChoose.bind null, choiceID}>
              {if choice.images?.length > 0
                thumbnailSrc = @props.task.images[choice.images[0]]
                <span className="survey-task-chooser-choice-thumbnail" role="presentation" style={backgroundImage: "url('#{thumbnailSrc}')"}></span>}
              <span className="survey-task-chooser-choice-label">{choice.label}</span>
            </button>}
      </div>
      <div style={textAlign: 'center'}>
        Showing {sortedFilteredChoices.length} of {@props.task.choicesOrder.length}.
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
