React = require 'react'
ReactDOM = require 'react-dom'
{Task, StartEndNode} = require './task.cjsx'

DETACHABLE = false

module.exports = React.createClass
  displayName: 'WorkflowNodes'

  getInitialState: ->
    {initialTask, keys, workflow, taskStateSet} = @getWorkflow()
    position = {}
    #if @props.workflow.metadata?.task_positions?
    #  pos = clone(@props.workflow.metadata.task_positions)
    taskStateSet: taskStateSet
    initialTask: initialTask
    uuid: keys.length
    uuids: keys
    workflow: workflow
    position: position
    allSet: false
    nextTask: {}
    previousTask: {}

  appendToDict: (dict, key, value) ->
    dict[key] ?= {}
    dict[key][value] = value

  addConnection: (c, id, nextTask, previousTask) ->
    @props.jp.connect({uuids: c, detachable: DETACHABLE})
    @appendToDict(nextTask, id, c[1])
    @appendToDict(previousTask, c[1], id)

  componentDidMount: ->
    nextTask = {}
    previousTask = {}
    # Once all nodes are drawn connect them up correctly
    for id in @state.uuids
      if id == @state.initialTask
        c = ['start', id]
        @props.jp.connect({uuids: c, detachable: DETACHABLE})
      task = @state.workflow[id]
      switch task.type
        when 'single'
          if task.subtask
            if task.next?
              c = ["#{id}_next", task.next]
              @addConnection(c, id, nextTask, previousTask)
          else
            for a, adx in task.answers
              c = ["#{id}_answer_#{adx}", if a.next then a.next else 'end']
              @addConnection(c, id, nextTask, previousTask)
        when 'multiple'
          if task.subtask
            if task.next?
              c = ["#{id}_next", task.next]
              @addConnection(c, id, nextTask, previousTask)
          else
            c = ["#{id}_next", if task.next then task.next else 'end']
            @addConnection(c, id, nextTask, previousTask)
        when 'drawing'
          c = ["#{id}_next", if task.next then task.next else 'end']
          @addConnection(c, id, nextTask, previousTask)
          for a, adx in task.tools
            if a.details[0]?
              c = ["#{id}_answer_#{adx}", a.details[0]]
              @addConnection(c, id, nextTask, previousTask)
        else
          c=["#{id}_next", if task.next then task.next else 'end']
          @addConnection(c, id, nextTask, previousTask)
      nextTask[id] ?= {'end': 'end'}
    @setState({nextTask: nextTask, previousTask: previousTask})
    #@sortTasks(connections)

  getUuid: (idx, uuid = @state.uuid, uuids = @state.uuids) ->
    if uuids[idx]?
      return uuids[idx]
    else
      return "T#{uuid}"

  setUuid: (id) ->
    current_uuids = @state.uuids.concat([id])
    current_uuid = @state.uuid + 1
    @setState({uuids: current_uuids, uuid: current_uuid})

  getWorkflow: ->
    # format workflow so 'init' is not a key and sub-tasks are their own tasks
    keys = []
    taskStateSet = {}
    workflow = {}
    initialTask = @props.workflow.first_task
    #L = Object.keys(@props.workflow.tasks).length
    L = 0
    for k, v of @props.workflow.tasks
      if k == 'init'
        # find a new name for 'init' (lowest task number not in use)
        ct = 0
        tmp = 'T' + ct
        while tmp of @props.workflow.tasks
          ct += 1
          tmp = 'T' + ct
        k = tmp
        if initialTask == 'init'
          initialTask = k
      keys.push(k)
      taskStateSet[k] = false
      # clone the workflow so it does not overwrite the original (will update the API after re-formatting)
      workflow[k] = clone(v)
      workflow[k].subTask = false
      if v.type == 'drawing'
        for tool, tdx in v.tools
          subList = []
          # make subtasks into their own tasks (use lowest task number not in use)
          if tool.details?
            for st, sdx in tool.details
              tmp = 'S' + L
              subList.push(tmp)
              keys.push(tmp)
              workflow[tmp] = clone(st)
              workflow[tmp].subtask = true
              L += 1
              # set 'next' to be the next subtask in the list (if it exists)
              if tool.details[sdx + 1]?
                workflow[tmp].next = 'S' + L
          # replace details with a list of keys
          workflow[k].tools[tdx].details = subList
    # make sure the keys are in number order
    keys.sort()
    {initialTask, keys, workflow, taskStateSet}

  doSort: (task_map, t, D) ->
    for i of task_map[t]
      msg = i + ' ' + D[i] + ' ,' + D[t]
      if (i not of D) or (D[i] <= D[t])
        D[i] = D[t] + 1
      @doSort(task_map, i, D)

  sortTasks: ->
    start = @state.initialTask
    D = {}
    D[@state.initialTask] = 0
    @doSort(@state.nextTask, start, D)
    levels = {}
    for k,v of D
      if levels[v]?
        levels[v].push(k)
      else
        levels[v] = [k]
    posX = 150
    w = 0
    for i in [0...Object.keys(levels).length]
      max_width = 0
      posY = 20
      for t in levels[i]
        # move the task div
        if @state.previousTask[t]?
          N = 0
          if @state.workflow[t]?.subtask and not @state.workflow[Object.keys(@state.previousTask[t])[0]].subtask
            previousY = 65
          else
            previousY = 0
          for pt of @state.previousTask[t]
            previousY += parseFloat(ReactDOM.findDOMNode(@refs[pt]).style.top)
            N += 1
          previousY /= N
          if previousY > posY
            posY = previousY
        @refs[t].moveMe({left: posX, top: posY})
        # calculate new y position
        DOMNode = ReactDOM.findDOMNode(@refs[t])
        posY += DOMNode.offsetHeight + 40
        # calculate next x position
        w = DOMNode.offsetWidth
        if w > max_width
          max_width = w
      posX += 70 + max_width

  taskMove: (id) ->
    if @state.allSet
      position = @refs[id].state.style
      currentPosition = @state.position
      newPosition =
        left: position.left
        top: position.top
      if position.width
        newPosition.width = position.width
      currentPosition[id] = newPosition
      # TODO add code to save positions to workflow metadata (when this is allowed)
      #change = {}
      #change["metadata.task_positions.#{id}"] = new_pos
      #@props.workflow.update(change)
      #@props.workflow.save()
      @setState({position: currentPosition})

  setTaskState: (id) ->
    if not @state.allSet
      currentTaskState = @state.taskStateSet
      currentTaskState[id] = true
      @setState({taskStateSet: currentTaskState}, @allTasksSet)

  allTasksSet: ->
    s = true
    for id, taskSet of @state.taskStateSet
      s &= taskSet
    if s and not @state.allSet
      @setState({allSet: true}, @sortTasks)

  createTask: (id, idx) ->
    if @state.position[id]?
      position = @state.position[id]
    else
      position =
        left: 100 + 240*idx + 'px'
        top: 0 + 'px'
    <Task {...@props} workflow={@state.workflow} key={id} plumbId={id} taskKey={id} taskNumber={idx} initialPosition={position} ref={id} onMove={@taskMove} onDone={@setTaskState.bind(@, id)} />

  render: ->
    tasks = (@createTask(id, idx) for id,idx in @state.uuids)
    <div id='editor' className='editor noselect'>
      <StartEndNode jp={@props.jp} type='start' onMove={@taskMove} ref='start' key='start' />
      <StartEndNode jp={@props.jp} type='end' onMove={@taskMove} ref='end' key='end' />
      {tasks}
    </div>

# A function to clone JSON object
clone = (obj) ->
  return JSON.parse(JSON.stringify(obj))
