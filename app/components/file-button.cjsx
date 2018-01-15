React = require 'react'
createReactClass = require 'create-react-class'

module.exports = createReactClass
  displayName: 'FileButton'

  getDefaultProps: ->
    tag: 'label'
    className: ''
    accept: '*/*'
    multiple: false
    disabled: false
    onSelect: Function.prototype

  getInitialState: ->
    resetting: false

  rootStyle:
    position: 'relative'

  containerStyle:
    height: '100%'
    left: 0
    opacity: 0.01
    overflow: 'hidden'
    position: 'absolute'
    top: 0
    width: '100%'

  inputStyle:
    cursor: 'pointer'
    height: '300%'
    left: '-100%'
    opacity: 0.01
    position: 'absolute'
    top: '-100%'
    width: '300%'

  render: ->
    input = if @state.resetting
      null
    else
      {accept, multiple, disabled} = @props
      passedProps = {accept, multiple, disabled}
      <input type="file" {...passedProps} style={@inputStyle} onChange={@handleChange} />

    React.createElement @props.tag,
      className: "file-button #{@props.className}".trim()
      style: Object.assign {}, @rootStyle, @props.style
      'data-accept': @props.accept
      'data-disabled': @props.disabled || null
      'data-multiple': @props.multiple || null
      <span style={@containerStyle}>{input}</span>,
      @props.children

  handleChange: ->
    @props.onSelect arguments...
    @setState resetting: true

  componentDidUpdate: ->
    if @state.resetting
      @setState resetting: false
