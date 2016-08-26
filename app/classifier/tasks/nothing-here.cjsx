React = require 'react'

module.exports = React.createClass
  displayName: 'NothingHere'

  getDefaultProps: ->
    classification: null
    task: null

  toggleShortcut: (e) ->
    @props.task.shortcut = if e.target.checked
      true
    else
      false
    @props.classification.update 'annotations'

  render: ->
    <label className="answer-button">
      <p>
        <small className="nothing-here-shortcut #{if @props.task.shortcut then 'active' else ''}">
          <strong>
            <input type="checkbox" onChange={@toggleShortcut} />
              Nothing Here
          </strong>
        </small>
      </p>

    </label>
