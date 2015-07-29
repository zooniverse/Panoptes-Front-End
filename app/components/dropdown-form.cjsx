React = require 'react'

ESC_KEY = 27

DropdownForm = React.createClass
  displayName: 'DropdownForm'

  getDefaultProps: ->
    anchor: null
    required: false
    onSubmit: Function.prototype
    onCancel: Function.prototype

  underlayStyle:
    bottom: 0
    left: 0
    position: 'fixed'
    right: 0
    top: 0

  pointerStyle:
    bottom: '100%'
    position: 'absolute'
    transform: 'translate(-50%, -50%) rotate(45deg)'

  formStyle:
    position: 'absolute'

  componentDidMount: ->
    @reposition()
    addEventListener 'scroll', @reposition
    addEventListener 'resize', @reposition
    for img in @getDOMNode().querySelectorAll 'img'
      img.addEventListener 'load', @reposition
    addEventListener 'keydown', @handleGlobalKeyDown

  componentWillUnmount: ->
    removeEventListener 'scroll', @reposition
    removeEventListener 'resize', @reposition
    for img in @getDOMNode().querySelectorAll 'img'
      img.removeEventListener 'load', @reposition
    removeEventListener 'keydown', @handleGlobalKeyDown

  reposition: (e) ->
    form = @refs.form.getDOMNode()
    pointer = @refs.pointer.getDOMNode()
    anchorRect = @props.anchor.getBoundingClientRect()

    left = anchorRect.left - ((form.offsetWidth - @props.anchor.offsetWidth) / 2)
    left = Math.max left, 0
    left = Math.min left, innerWidth - form.offsetWidth

    top = anchorRect.bottom

    form.style.left = "#{left}px"
    form.style.top = "#{top}px"

    pointer.style.left = "#{anchorRect.left + (@props.anchor.offsetWidth / 2)}px"
    pointer.style.top = "#{top + parseFloat(getComputedStyle(form).marginTop)}px"

  handleGlobalKeyDown: (e) ->
    unless @props.required
      if e.which is ESC_KEY
        @props.onCancel arguments...

  render: ->
    <div className="dropdown-form-underlay" style={@underlayStyle} onClick={@handleUnderlayClick}>
      <div ref="pointer" className="dropdown-form-pointer" style={@pointerStyle}></div>
      <form ref="form" className="dropdown-form" style={@formStyle} action="POST" onSubmit={@handleSubmit}>
        {@props.children}
      </form>
    </div>

  handleSubmit: (e) ->
    e.preventDefault()
    @props.onSubmit arguments...

  handleUnderlayClick: (e) ->
    unless @props.required
      if e.target is @getDOMNode()
        @props.onCancel arguments...

module.exports = React.createClass
  displayName: 'DropdownFormButton'

  getDefaultProps: ->
    tag: 'button'
    label: '···'
    required: false
    onClick: Function.prototype
    onSubmit: Function.prototype
    onCancel: Function.prototype

  getInitialState: ->
    root: null

  componentWillUnmount: ->
    @close()

  open: ->
    root = document.createElement 'div'
    root.classList.add 'dropdown-form-root'
    document.body.appendChild root

    @setState {root}

    React.render <DropdownForm anchor={@getDOMNode()} required={@props.required} onSubmit={@handleSubmit} onCancel={@handleCancel}>
      {@props.children}
    </DropdownForm>, root

  close: ->
    @getDOMNode().focus()
    if @state.root?
      React.unmountComponentAtNode @state.root
      @state.root.parentNode.removeChild @state.root
      @setState root: null

  render: ->
    React.createElement @props.tag,
      className: "dropdown-form-button"
      onClick: @handleClick
      'data-is-open': @state.root? || null
      @props.label

  handleClick: ->
    @open()
    @props.onClick arguments...

  handleSubmit: ->
    @close()
    @props.onSubmit arguments...

  handleCancel: ->
    @close()
    @props.onCancel arguments...
