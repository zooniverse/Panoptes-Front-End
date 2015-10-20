React = require 'react'
icons = require '../../../classifier/tasks/drawing/icons'
{Markdown} = require 'markdownz'

# Styling for ansers within a list
# AnswerItem takes in `input`, `eps`, and `jp` as props
# `jp` is the jsPlumb instance for the visualizer
# `eps` = {add: add endput callback, remove: remove endpoint callback, zIndex: the z-index of the task, endpionts: list of all endpoints}
# `inputs` = {listId: unique uuid for endpoint, item: answer or tool, type: type of task, idx: current index of answer or tool}
AnswerItem = React.createClass
  displayName: 'AnswerItem'

  render: ->
    if @props.inputs.type == 'drawing'
      icon = <span className='drawing-tool-icon-vis' style={color: @props.inputs.item.color}>{icons[@props.inputs.item.type]}</span>
    else
      icon = undefined
    <li className='answer-item' id={@props.inputs.listId}>
      <div className='lab'>
        {icon}
        <Markdown className='markdown-vis'>{@props.inputs.item.label}</Markdown>
      </div>
    </li>

# Populate a list containing tools/answers for a task
# props are `plumbId`, `inputs`, `task`, and `jp`
# `plumbId` is a unique ID for the task
# `jp` is the jsPlumb instance for the visualizer
# `task` is the workflow task
# `inputs` = {uuid: {set: set a new uuid, get: get a new/existing uuid}, eps: {add: add endput callback, remove: remove endpoint callback, zIndex: the z-index of the task, endpionts: list of all endpoints}}
module.exports = React.createClass
  displayName: 'AnswerList'

  createAnswers: ->
    if @props.task.type == 'drawing'
      items = @props.task.tools
    else
      items = @props.task.answers
    answers = []
    for idx, item of items
      inputs =
        idx: idx
        item: item
        listId: @props.inputs.uuid.get(idx)
        type: @props.task.type
      answers.push(<AnswerItem jp={@props.jp} key={"Al_#{idx}"} inputs={inputs} eps={@props.inputs.eps} />)
    answers

  render: ->
    <ul className='list-unstyled' id={"#{@props.plumbId}_answers"}>
      {@createAnswers()}
    </ul>
