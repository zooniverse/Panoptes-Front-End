React = require 'react'

module.exports = React.createClass
  displayName: 'CropSummary'

  render: ->
    {x, y, width, height} = @props.annotation.value
    <div className="classification-task-summary">
      <div className="question">
        {@props.task.instruction}
      </div>
      <div className="answer">
        {Math.round width} &times; {Math.round height} at {Math.round x}, {Math.round y}
      </div>
    </div>
