React = require 'react'

module.exports = React.createClass
  displayName: 'NothingHere'

  getDefaultProps: ->
    classification: null
    task: null

  componentWillReceiveProps: (nextProps) ->
    if nextProps.task.shortcut is true
      if nextProps.annotation.value instanceof Array
        @removeShortcuts(nextProps) if nextProps.annotation.value?.length > 0
      else if nextProps.annotation.value isnt null
        @removeShortcuts(nextProps)

  removeShortcuts: (nextProps) ->
    for shortcut in nextProps.task.nothingHere
      if shortcut.checked
        shortcut.checked = false
    nextProps.task.shortcut = false
    nextProps.classification.update 'annotations'

  toggleShortcut: (index, e) ->
    if e.target.checked
      @props.task.shortcut = true
      @props.task.nothingHere[index].checked = true
      if @props.annotation.value instanceof Array
        @props.annotation.value = []
      else
        @props.annotation.value = null
    else
      @props.task.nothingHere[index].checked = false
      @props.task.shortcut = false unless @activeShortcut()
    @props.classification.update 'annotations'

  activeShortcut: ->
    active = false
    for shortcut in @props.task.nothingHere
      active = true if shortcut.checked is true
    active

  render: ->
    # Rename nothingHere to shortcuts?

    <div>

      {if @props.task.nothingHere
        for shortcut, index in @props.task.nothingHere
          shortcut._key ?= Math.random()
          <label key={shortcut._key} className="answer-button">
            <p>
              <small className="nothing-here-shortcut #{if shortcut.checked then 'active' else ''}">
                <strong>
                  <input type="checkbox" checked={shortcut.checked} onChange={@toggleShortcut.bind this, index} />
                    {shortcut.label}
                </strong>
              </small>
            </p>

          </label>}
    </div>
