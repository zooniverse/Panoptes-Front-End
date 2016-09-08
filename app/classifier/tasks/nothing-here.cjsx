React = require 'react'

module.exports = React.createClass
  displayName: 'NothingHere'

  getDefaultProps: ->
    classification: null
    task: null

  toggleShortcut: (index, e) ->
    if e.target.checked
      @props.task.nothingHere[index].checked = true
    else
      @props.task.nothingHere[index].checked = false
    @props.classification.update 'annotations'

  render: ->
    # TODO: allow nothing here to deselect other options. Refer to generic editor choiceskey
    # Rename nothingHere to shortcuts?

    <div>

      {if @props.task.nothingHere
        for shortcut, index in @props.task.nothingHere
          shortcut._key ?= Math.random()
          <label key={shortcut._key} className="answer-button">
            <p>
              <small className="nothing-here-shortcut #{if shortcut.checked then 'active' else ''}">
                <strong>
                  <input type="checkbox" onChange={@toggleShortcut.bind this, index} />
                    {shortcut.label}
                </strong>
              </small>
            </p>

          </label>}
    </div>
