React = require 'react'

ESC_KEY = 27

DropdownForm = React.createClass
  displayName: 'DropdownForm'

  getDefaultProps: ->
    className: ''
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

  formStyle:
    position: 'absolute'

  componentDidMount: ->
    @reposition()
    addEventListener 'resize', @reposition
    addEventListener 'scroll', @reposition
    addEventListener 'keydown', @handleGlobalKeyDown

  componentWillUnmount: ->
    removeEventListener 'resize', @reposition
    removeEventListener 'scroll', @reposition
    removeEventListener 'keydown', @handleGlobalKeyDown

  reposition: ->
    form = @refs.form.getDOMNode()
    anchorRect = @props.anchor.getBoundingClientRect()

    top = anchorRect.bottom

    left = anchorRect.left - ((form.offsetWidth - @props.anchor.offsetWidth) / 2)
    left = Math.max left, 0
    left = Math.min left, innerWidth - form.offsetWidth

    form.style.top = "#{top}px"
    form.style.left = "#{left}px"

  handleGlobalKeyDown: (e) ->
    unless @props.required
      if e.which is ESC_KEY
        @props.onCancel arguments...

  render: ->
    <div className="dropdown-form-underlay #{@props.className}" style={@underlayStyle} onClick={@handleUnderlayClick}>
      <form ref="form" className="dropdown-form #{@props.className}" style={@formStyle} onSubmit={@handleSubmit}>
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
  displayName: 'DropdownFormTrigger'

  getDefaultProps: ->
    tag: 'button'
    className: ''
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

    React.render <DropdownForm className={@props.className} anchor={@getDOMNode()} required={@props.required} onSubmit={@handleSubmit} onCancel={@handleCancel}>
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
      className: "dropdown-form-button #{@props.className}"
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
