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
    background: 'rgba(127, 127, 127, 0.1)'
    bottom: 0
    left: 0
    position: 'fixed'
    right: 0
    top: 0

  componentDidMount: ->
    @reposition()
    addEventListener 'keydown', @handleGlobalKeyDown

  componentWillUnmount: ->
    removeEventListener 'keydown', @handleGlobalKeyDown

  reposition: ->
    console.log 'Will anchor to', @props.anchor

  handleGlobalKeyDown: (e) ->
    unless @props.required
      if e.which is ESC_KEY
        @props.onCancel arguments...

  render: ->
    <div className="dropdown-form-underlay" style={@underlayStyle} onClick={@handleUnderlayClick}>
      <form className="dropdown-form" onSubmit={@handleSubmit}>
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
    className: 'dropdown-form-label'
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
    if @state.root?
      React.unmountComponentAtNode @state.root
      @state.root.parentNode.removeChild @state.root
      @setState root: null

  render: ->
    React.createElement @props.tag,
      className: @props.className
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
