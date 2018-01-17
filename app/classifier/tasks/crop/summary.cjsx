React = require 'react'
createReactClass = require 'create-react-class'

module.exports = createReactClass
  displayName: 'CropSummary'

  render: ->
    summaryContent = if @props.annotation.value?
      {x, y, width, height} = @props.annotation.value
      <span>
        {Math.round width} &times; {Math.round height} at {Math.round x}, {Math.round y}
      </span>
    else
      <small>No area cropped</small>

    <div>
      <div className="question">
        {@props.task.instruction}
      </div>
      <div className="answer">
        {summaryContent}
      </div>
    </div>
