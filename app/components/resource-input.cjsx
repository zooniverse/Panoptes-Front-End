React = require 'react'
handleInputChange = require '../lib/handle-input-change'

module.exports = React.createClass
  displayName: 'ResourceInput'

  getDefaultProps: ->
    type: 'text'
    resource: {}
    update: null
    delay: 10 * 1000 # Save when idle for ten seconds, otherwise on blur.

  getInitialState: ->
    timeout: NaN
    saving: null
    success: null
    error: null

  isRadioOrCheckbox: ->
    @props.type in ['radio', 'checkbox']

  render: ->
    tagName = switch @props.type
      when 'textarea' then @props.type
      else 'input'

    value = @props.value
    value ?= do =>
      path = @props.update.split '.'
      result = @props.resource
      until path.length is 0
        segment = path.shift()
        result = result?[segment]
      result

    isRadioOrCheckbox = @isRadioOrCheckbox()

    if @props.children?
      labelContent = <span className="resource-input-label">
        {@props.children}
      </span>

    changeDelay = if isRadioOrCheckbox
      0
    else
      @props.delay

    <label
      className="resource-input-label"
      data-type={@props.type}
      data-waiting={not isNaN(@state.timeout) || null}
      data-busy={@state.saving? || null}
      data-success={@state.success? || null}
      data-error={@state.error? || null}
      title={@state.error?.toString()}>

      {unless isRadioOrCheckbox
        labelContent}

      {React.createElement tagName,
        Object.assign {}, @props,
        children: null
        name: @props.update
        value: value unless isRadioOrCheckbox
        checked: value if isRadioOrCheckbox
        onChange: @handleChange
        onBlur: @handleBlur}

      {if isRadioOrCheckbox
        labelContent}
    </label>

  handleChange: ->
    handleInputChange.apply @props.resource, arguments

    delay = if @isRadioOrCheckbox()
      0
    else
      @props.delay

    @saveResourceAfter delay

  handleBlur: ->
    if @props.resource.hasUnsavedChanges()
      delay = if @state.saving?
        @props.delay
      else
        0
      @saveResourceAfter delay

  saveResourceAfter: (delay) ->
    unless isNaN @state.timeout
      clearTimeout @state.timeout

    saveCall = =>
      @setState
        timeout: NaN
        saving: @props.resource.save()
          .then (success) =>
            @setState {success}
          .catch (error) =>
            @setState {error}
          .then =>
            @setState
              saving: null

    timeout = setTimeout saveCall, delay

    @setState
      timeout: timeout
      success: null
      error: null
