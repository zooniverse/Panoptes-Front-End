React = require 'react'
createReactClass = require 'create-react-class'
talkClient = require 'panoptes-client/lib/talk-client'

module.exports = createReactClass
  displayName: 'StickyDiscussionList'

  placeholder: ->
    @placeholder or= document.getElementById("talk-sticky-placeholder")
    @placeholder

  getInitialState: ->
    data: []

  componentDidMount: ->
    @reloadList()

  reloadList: ->
    @getStickyDiscussions().then (data) => @setState data: data

  getStickyDiscussions: ->
    talkClient.type('discussions').get board_id: @props.board.id, sticky: true

  stickyDiscussion: (discussion) ->
    <li data-id={discussion.id}
        key={discussion.id}
        draggable="true"
        onDragEnd={@dragEnd}
        onTouchEnd={@touchEnd}
        onDragStart={@dragStart}
        onTouchStart={@touchStart}
        className="fa fa-bars bars">
      {discussion.title}
    </li>

  dragStart: (e) ->
    @start e
    e.dataTransfer?.effectAllowed = 'move'
    e.dataTransfer?.setData 'text/html', e.currentTarget

  touchStart: (e) ->
    @start e
    @startY = e.targetTouches[0].clientY

  start: (e) ->
    @dragged = e.currentTarget
    @first = @last = false
    @placeholder().innerHTML = @dragged.innerHTML

  dragEnd: (e) ->
    @end e

  touchEnd: (e) ->
    @end e
    @translate @dragged, 0

  end: (e) ->
    @dragged.style.display = 'block'
    @dragged.parentNode.removeChild @placeholder()
    @placeholder().dataset.content = ''
    @swap()

  dragMove: (e) ->
    e.preventDefault()
    @dragged.style.display = 'none'
    return if e.target.className is 'placeholder'
    @over = e.target
    e.target.parentNode.insertBefore @placeholder(), e.target

  touchMove: (e) ->
    e.preventDefault()
    touch = e.targetTouches[0]
    @dragged.style.display = 'none'
    target = document.elementFromPoint touch.clientX, touch.clientY
    return if target?.className is 'placeholder'

    @over = target if target
    offset = touch.clientY - @startY
    try
      @dragged.parentNode.insertBefore @placeholder(), target
      @first = @last = false
    catch
      if offset > 0
        # insert after last item
        @last = true
        @dragged.parentNode.insertBefore @placeholder(), null
      else
        # insert before first item
        @first = true
        @dragged.parentNode.insertBefore @placeholder(), @dragged.parentNode.children[0]

    @translate touch.target, offset

  swap: ->
    data = @state.data
    [from, to] = @findIndexesIn data
    data.splice to, 0, data.splice(from, 1)[0]
    positionBefore = data[to - 1]?.sticky_position or 1.0
    positionAfter = data[to + 1]?.sticky_position or 100.0
    newPosition = (positionBefore + positionAfter) / 2.0
    @setState data: data
    data[to].update(sticky_position: newPosition).save().then @reloadList

  findIndexesIn: (data) ->
    from = 0
    to = 0
    for datum, i in data
      from = i if datum.id is +@dragged.dataset.id
      to = i if datum.id is +@over.dataset.id

    to -= 1 if from < to
    to = 0 if @first
    to = data.length - 1 if @last
    [from, to]

  translate: (y) ->
    amount = "translate(0px, #{ y }px)"
    @dragged.style.webkitTransform = amount
    @dragged.style.msTransform = amount
    @dragged.style.transform = amount

  render: ->
    <div className="talk-sticky-list">{
      if @state.data?.length > 0
        <ul onDragOver={@dragMove} onTouchMove={@touchMove}>
          {@state.data.map(@stickyDiscussion)}
        </ul>
      else
        <p>There are no sticky discussions on this board</p>
    }</div>
