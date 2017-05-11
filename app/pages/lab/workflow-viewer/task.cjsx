React = require 'react'
ReactDOM = require 'react-dom'
Resizable = require('react-component-resizable').default
{TaskName, RequireBox, HelpButton} = require './task-helpers'
AnswerList = require './answers'
jsPlumbStyle = require './jsplumb-style'

# keep track of the max z-index
max_z = 0

# Firefox needs an offset patch for jsPlumb elements (not sure way)
isFirefox = typeof InstallTrigger != 'undefined'

# timer to detect when resize stops
timer = null

# Make a task node
# Takes `plumbId`, `workflow`, `taskKey`, `pos`, and `taskNumber` as a props
Task = React.createClass
  displayName: 'Task'

  getInitialState: ->
    task: @props.workflow[@props.taskKey]
    endpoints: []
    uuid: 0
    uuids: []
    style: @computeInitialStyle(@props.initialPosition, @props.taskNumber)
    width:
      min: 0
      max: 0
      val: 0

  computeInitialStyle: (initialPosition, taskNumber) ->
    style = initialPosition
    style['zIndex'] = taskNumber + 2
    style

  componentDidMount: ->
    me = ReactDOM.findDOMNode(@)
    # make node draggable using jsPlumb
    dragOptions =
      handle: '.drag-handel'
      start: @onDrag
      stop: @onDragStop
    @props.jp.draggable(@props.plumbId, dragOptions)
    if @state.task.type == 'drawing'
      ep = @props.jp.addEndpoint(@props.plumbId, jsPlumbStyle.commonTDraw, {uuid: @props.plumbId})
    else
      ep = @props.jp.addEndpoint(@props.plumbId, jsPlumbStyle.commonT, {uuid: @props.plumbId})
    ep.canvas.style['z-index'] = @state.style.zIndex
    eps = [ep]
    # make subtask endpoints
    if @state.task.subtask
      ep = @props.jp.addEndpoint(@props.plumbId+'_name', jsPlumbStyle.commonAOpen, {uuid: @props.plumbId + '_next'})
      ep.canvas.style['z-index'] = @state.style.zIndex
      eps.push(ep)
    else
      # make sure answer/tool endpoints are drawn *after* the div is draggable and has its endpoint
      if (@state.task.type != 'multiple')
        uuids = []
        uuid = 0
        if @state.task.type in ['single', 'multiple', 'drawing']
          if @state.task.type == 'single'
            L = Object.keys(@state.task.answers).length
          else
            L = Object.keys(@state.task.tools).length
          for idx in [0...L]
            id = @getUuid(idx, uuid, uuids)
            uuids.push(id)
            uuid +=1
            switch @state.task.type
              when 'single' then ep = @props.jp.addEndpoint(id, jsPlumbStyle.commonA, {uuid: id})
              when 'drawing' then ep = @props.jp.addEndpoint(id, jsPlumbStyle.commonAOpen, {uuid: id})
            ep.canvas.style['z-index'] = @state.style.zIndex
            eps.push(ep)
        @setUuid(null, uuid, uuids)
      if @state.task.type != 'single'
        ep = @props.jp.addEndpoint(@props.plumbId+'_name', jsPlumbStyle.commonA, {uuid: @props.plumbId + '_next'})
        ep.canvas.style['z-index'] = @state.style.zIndex
        eps.push(ep)
    computedStyle = window.getComputedStyle(me)
    style = @state.style
    style['width'] = computedStyle['width']
    new_state =
      style: style
      endpoints: eps
      width:
        min: parseFloat(computedStyle['min-width'])
        max: parseFloat(computedStyle['max-width'])
        val: parseFloat(computedStyle['width'])
    @setState(new_state, @props.onDone)

  # when the node is removed clean up all endpoints
  componentWillUnmount: ->
    for ep in @state.endpoints
      @props.jp.deleteEndpoint(ep)

  # define some setters and getters
  #==========================

  # Keep track of unique uuids to use for each answer DOM element
  # These can't be re-used after removal, otherwise the endpoint will not draw in the right spot
  # This is a limitation of jsPlumb
  setUuid: (id, uuid, uuids) ->
    current_uuids = uuids ? @state.uuids.concat([id])
    current_uuid =  uuid ? @state.uuid + 1
    @setState({uuids: current_uuids, uuid: current_uuid})

  # Get a unique uuid for an answer based on its position in the answer list
  getUuid: (idx, uuid = @state.uuid, uuids = @state.uuids) ->
    # When loading with answsers make sure to use idx since setState is not called until after the loop
    if uuids[idx]?
      return @state.uuids[idx]
    else
      return @props.plumbId + '_answer_' + idx

  # add an endpoint to the list of endpoints
  pushEps: (ep) ->
    eps = @state.endpoints.concat([ep])
    @setState({endpoints: eps})

  # remove an endpoint from the list of endpoints (always remove the last one)
  removeEps: ->
    eps = @state.endpoints[...-1]
    current_uuids = @state.uuids[...-1]
    @setState({endpoints: eps})
    @setState({uuids: current_uuids})

  # get css style to use
  updateStyle: ->
    me = ReactDOM.findDOMNode(@)
    style =
      left: me.style.left
      top: me.style.top
      width: me.style.width
      zIndex: @state.style.zIndex
    if @state.style.zIndex > max_z
      max_z = @state.style.zIndex
    @setState({style: style}, @onMove)

  validWidth: (width, type='string') ->
    width = parseInt(width)
    if width > @state.width.max
      width = @state.width.max
    if width < @state.width.min
      width = @state.width.min
    if type=='string'
      width+='px'
    width

  onMove: ->
    @props.onMove(@props.taskKey)

  # props to pass into AnswerList
  getInputs: ->
    inputs =
      eps:
        add: @pushEps
        remove: @removeEps
        zIndex: @state.style.zIndex
        endpoints: @state.endpoints
      uuid:
        set: @setUuid
        get: @getUuid

  # set positon
  moveMe: (position) ->
    me = ReactDOM.findDOMNode(@)
    me.style.left = position.left + 'px'
    me.style.top = position.top + 'px'
    if position.width?
      me.style.width = position.width + 'px'
    @onDrag()
    @updateEndpoints()
    @updateStyle()

  # define functions to take care of moving and resizing
  #=========================================

  # Make sure element being dragged is on top layer
  onDrag: (e) ->
    style = @state.style
    if style.zIndex < max_z
      max_z += 1
      ep.canvas.style['z-index'] = max_z for ep in @state.endpoints
      style.zIndex = max_z
      @setState({style: style})

  onDragStop: (e) ->
    @updateEndpoints()
    @updateStyle()

  onResize: (e) ->
    width = @state.width
    delta = e.width - width.val - 2
    # call a blank setState to update so the next resize will be detected
    @setState({width: width})
    for ep in @state.endpoints[1...]
      offset = @props.jp.getOffset(ep.elementId)
      offset.left += delta
      if isFirefox
        offset.left += 2
        offset.top += 2
      @props.jp.repaint(ep.elementId, offset)
      @props.jp.dragManager.updateOffsets(@props.plumbId)
    #console.log(delta)
    if timer != null
      clearTimeout(timer)
    timer = setTimeout(@onResizeStop, 150)

  onResizeStop: (e) ->
    me = ReactDOM.findDOMNode(@)
    @updateEndpoints()
    width = @state.width
    width.val = @validWidth(me.style.width, 'int')
    @setState({width: width}, @updateStyle)

  updateEndpoints: ->
    for ep in @state.endpoints
      @props.jp.revalidate(ep.elementId, null, true)
      if isFirefox
        offset = @props.jp.getOffset(ep.elementId)
        offset.top += 2
        offset.left += 2
        @props.jp.repaint(ep.elementId, offset)
    @props.jp.dragManager.updateOffsets(@props.plumbId)

  # defind function to render each type of task
  #===================================

  # Draw task
  render: ->
    # the things that change based on task type
    box_class = 'box noselect '
    helpButton = undefined
    if not @state.task.subtask and @state.task.help
      helpButton = <HelpButton workflow={@props.workflow} taskKey={@props.taskKey} zIndex={@state.style.zIndex} />
    #helpButton = @state.task.subtask ? undefined : <HelpButton workflow={@props.workflow} taskKey={@props.taskKey} zIndex={@state.style.zIndex} />
    box_class += "#{@state.task.type}-box"
    switch @state.task.type
      when 'single'
        icon = <i className="fa fa-dot-circle-o fa-fw"></i>
      when 'multiple'
        icon = <i className="fa fa-check-square-o fa-fw"></i>
      when 'drawing'
        icon = <i className="fa fa-pencil fa-fw"></i>
      when 'survey'
        icon = <i className="fa fa-binoculars fa-fw"></i>
      when 'crop'
        icon = <i className="fa fa-crop fa-fw"></i>
      when 'text'
        icon = <i className="fa fa-file-text-o fa-fw"></i>
      else
        icon = undefined

    inputs = @getInputs()
    <Resizable className={box_class} style={clone(@state.style)} id={@props.plumbId} ref={@props.plumbId} embedCss={false} onResize={@onResize}>
      <div className='drag-handel'>
        <span className='box-head noselect'>
          {"Sub-" if @state.task.subtask}{"Task #{@props.taskKey}: "}{icon}{" #{@state.task.type.charAt(0).toUpperCase()}#{@state.task.type.substr(1)}"}
        </span>
        <br />
      </div>
      <TaskName workflow={@props.workflow} taskKey={@props.taskKey} plumbId={@props.plumbId} />
      {helpButton}
      <RequireBox workflow={@props.workflow} taskKey={@props.taskKey} />
      <AnswerList jp={@props.jp} inputs={inputs} plumbId={@props.plumbId} task={@state.task} />
    </Resizable>

StartEndNode = React.createClass
  displayName: 'StartNode'

  getInitialState: ->
    ep: null
    style: @getInitialStyle()

  componentDidMount: ->
    drag_options =
      start: @onDrag
      stop: @onDragStop
    @props.jp.draggable(@props.type, drag_options)
    switch @props.type
      when 'start' then ep = @props.jp.addEndpoint(@props.type, jsPlumbStyle.commonA, {uuid: @props.type})
      when 'end' then ep = @props.jp.addEndpoint(@props.type, jsPlumbStyle.commonT, {uuid: @props.type})
    ep.canvas.style['z-index'] = @state.style.zIndex
    @setState({ep: ep})
    @props.onMove(@props.type)

  moveMe: (position) ->
    me = ReactDOM.findDOMNode(@)
    style =
      left: position.left + ''
      top: position.top + ''
    me.style.left = if style.left[-2..] == 'px' or style.left[-1] == '%' then style.left else style.left + 'px'
    me.style.top = if style.top[-2..] == 'px' or style.top[-1] == '%' then style.top else style.top + 'px'
    @updateEndpoints()
    @props.jp.revalidate(@state.ep.elementId, null, true)
    @updateStyle()

  onMove: ->
    @props.onMove(@props.type)

  onDrag: ->
    ep = @state.ep
    if @state.style.zIndex < max_z
      max_z += 1
      ep.canvas.style['z-index'] = max_z
      style = @state.style
      style.zIndex = max_z
      @setState({style: style, ep: ep})

  onDragStop: (e) ->
    @updateEndpoints()
    @updateStyle()

  updateStyle: ->
    me = ReactDOM.findDOMNode(@)
    style =
      left: me.style.left
      top: me.style.top
      zIndex: @state.style.zIndex
    @setState({style: style}, @onMove)

  updateEndpoints: ->
    @props.jp.revalidate(@state.ep.elementId, null, true)

  getInitialStyle: ->
    style =
      top: '50%'
      zIndex: 1
    switch @props.type
      when 'start' then style['left'] = '0%'
      when 'end' then style['right'] = '0%'
    style

  render: ->
    classString = 'box-end noselect ' + @props.type
    <div className={classString} id={@props.type} style={clone(@state.style)}>
      {@props.type.charAt(0).toUpperCase() + @props.type.slice(1)}
    </div>
#

# A function to clone JSON object
clone = (obj) ->
  return JSON.parse(JSON.stringify(obj))

module.exports = {
  Task
  StartEndNode
}
