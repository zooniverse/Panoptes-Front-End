React = require 'react'
AutoSave = require '../../components/auto-save'

NOOP = Function.prototype

module.exports = React.createClass
  displayName: 'NothingHere'

  getDefaultProps: ->
    task: null
    onChange: NOOP

  toggleShortcut: (e) ->
    @props.task.shortcut = if e.target.checked
      true
    else
      false
    @props.classification.update 'annotations'

  render: ->
    console.log @props
    <div>
      <p>
        <small>
          <strong>
            <input type="checkbox" className="minor-button" onChange={@toggleShortcut} />
              Nothing Here
          </strong>
        </small>
      </p>
    </div>
