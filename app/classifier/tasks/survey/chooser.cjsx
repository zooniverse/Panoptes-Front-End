React = require 'react'
TriggeredModalForm = require 'modal-form/triggered'
sortIntoColumns = require 'sort-into-columns'

# key codes
BACKSPACE = 8
UP = 38
DOWN = 40

module.exports = React.createClass
  displayName: 'Chooser'

  getDefaultProps: ->
    task: null
    filters: {}
    onFilter: Function.prototype
    onChoose: Function.prototype

  componentWillMount: ->
    # refs for the choices
    @choiceButtons = []

  componentDidMount: ->
    @sortChoiceButtons()

  componentDidUpdate: ->
   @sortChoiceButtons()

  sortChoiceButtons: ->
    # overrides default DOM focus order by sorting the buttons according to task.choicesOrder
    newChoiceButtons = []
    @choiceButtons
      .filter Boolean
      .map (button) =>
        choiceID = button.getAttribute 'data-choiceID'
        index = @props.task.choicesOrder.indexOf choiceID
        newChoiceButtons[index] = button
    @choiceButtons = newChoiceButtons.filter Boolean

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
    @choiceButtons = []

    filteredChoices = @getFilteredChoices()

    thumbnailSize = @whatSizeThumbnails filteredChoices

    columnsCount = @howManyColumns filteredChoices
    sortedFilteredChoices = sortIntoColumns filteredChoices, columnsCount

    <div className="survey-task-chooser">
      <div className="survey-task-chooser-characteristics">
        {for characteristicID, i in @props.task.characteristicsOrder
          characteristic = @props.task.characteristics[characteristicID]
          selectedValue = characteristic.values[@props.filters[characteristicID]]
          hasBeenAutoFocused = false

          <TriggeredModalForm key={characteristicID} ref="#{characteristicID}-dropdown" className="survey-task-chooser-characteristic-menu" triggerProps={autoFocus: i is 0 and not @props.focusedChoice} trigger={
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

                <button
                  key={valueID}
                  type="submit"
                  title={value.label}
                  className="survey-task-chooser-characteristic-value"
                  disabled={disabled}
                  data-selected={selected}
                  autoFocus={autoFocus}
                  onClick={@handleFilter.bind this, characteristicID, valueID}
                >
                  {if value.image?
                    <img src={@props.task.images[value.image]} alt={value.label} className="survey-task-chooser-characteristic-value-icon" />
                  else
                    value.label}
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
          selectedChoices = (item.choice for item in @props.annotation.value)

          for choiceID, i in sortedFilteredChoices
            choice = @props.task.choices[choiceID]
            chosenAlready = choiceID in selectedChoices
            <button
              autoFocus={choiceID is @props.focusedChoice}
              key={choiceID}
              data-choiceID={choiceID}
              ref={(button) => @choiceButtons.push button}
              type="button"
              className="survey-task-chooser-choice-button #{'survey-task-chooser-choice-button-chosen' if chosenAlready}"
              onClick={@props.onChoose.bind null, choiceID}
              onKeyDown={@handleKeyDown.bind(this, choiceID)}
            >
              <span className="survey-task-chooser-choice">
                {if choice.images?.length > 0
                  thumbnailSrc = @props.task.images[choice.images[0]]
                  <span className="survey-task-chooser-choice-thumbnail" role="presentation" style={backgroundImage: "url('#{thumbnailSrc}')"}></span>}
                <span className="survey-task-chooser-choice-label">{choice.label}</span>
              </span>
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

  handleKeyDown: (choiceID, e) ->
    switch e.which
      when BACKSPACE
        @props.onRemove choiceID
        e.preventDefault()
      when UP
        index = @choiceButtons.indexOf document.activeElement
        newIndex = index - 1
        if newIndex is -1 then newIndex = @choiceButtons.length - 1
        @choiceButtons[newIndex].focus()
        e.preventDefault()
      when DOWN
        index = @choiceButtons.indexOf document.activeElement
        newIndex = (index + 1) % @choiceButtons.length
        @choiceButtons[newIndex].focus()
        e.preventDefault()
      else
        true
    
