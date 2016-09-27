React = require 'react'

module.exports = React.createClass
  displayName: 'NothingHere'

  getDefaultProps: ->
    annotation: null
    classification: null
    options: []

  componentWillReceiveProps: (nextProps) ->
    if nextProps.annotation.shortcut
      if nextProps.annotation.value instanceof Array
        @removeShortcuts(nextProps) if nextProps.annotation.value?.length > 0
      else if nextProps.annotation.value isnt null
        @removeShortcuts(nextProps)

  removeShortcuts: (nextProps) ->
    nextProps.annotation.shortcut = false
    nextProps.classification.update 'annotations'

  toggleShortcut: (index, shortcut, e) ->
    if e.target.checked
      @props.annotation.shortcut = shortcut.label
      if @props.annotation.value instanceof Array
        @props.annotation.value = []
      else
        @props.annotation.value = null
    else
      @props.annotation.shortcut = false
    @props.classification.update 'annotations'

  render: ->
    <div>

      {for shortcut, index in @props.options
          shortcut._key ?= Math.random()
          <p>
            <label key={shortcut._key} className="answer-button">
              <small className="nothing-here-shortcut #{if shortcut.label is @props.annotation.shortcut then 'active' else ''}">
                <strong>
                  <input type="checkbox" checked={shortcut.label is @props.annotation.shortcut} onChange={@toggleShortcut.bind this, index, shortcut} />
                    {shortcut.label}
                </strong>
              </small>
            </label>
          </p>}

    </div>
