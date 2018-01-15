React = require 'react'
createReactClass = require 'create-react-class'

requestCounter = 0

module.exports = createReactClass
  displayName: 'AutoSave'

  getDefaultProps: ->
    tag: 'span'
    className: 'auto-save'
    resource: null
    keyboardDelay: 10 * 1000
    immediateDelay: 0
    resetDelay: 2 * 1000

  getInitialState: ->
    timeout: NaN
    request: NaN
    saving: null
    success: null
    error: null

  render: ->
    React.createElement @props.tag,
      className: @props.className
      'data-waiting': not isNaN(@state.timeout) || null
      'data-busy': @state.saving? || null
      'data-success': @state.success? || null
      'data-error': @state.error? || null
      title: @state.error?.toString()
      onChange: @handleChange
      onClick: @handleClick
      onBlur: @handleBlur
      @props.children

  isTextInput: (el) ->
    el.tagName in ['INPUT', 'TEXTAREA'] and el.type not in ['radio', 'checkbox']

  handleChange: (e) ->
    e.persist()
    # console?.log 'AutoSave::handleChange', e
    delay = if @isTextInput e.target
      @props.keyboardDelay
    else
      @props.immediateDelay
    @saveResourceAfter delay

  handleClick: (e) ->
    if e.target.tagName is 'BUTTON'
      e.persist()
      # console?.log 'AutoSave::handleClick', e
      @saveResourceAfter @props.immediateDelay

  handleBlur: (e) ->
    if @isTextInput e.target
      e.persist()
      # console?.log 'AutoSave::handleBlur', e
      delay = if @state.saving?
        @props.keyboardDelay
      else
        @props.immediateDelay
      @saveResourceAfter delay

  saveResourceAfter: (delay) ->
    unless isNaN @state.timeout
      clearTimeout @state.timeout

    saveCall = =>
      @setState
        timeout: NaN
      if @props.resource.hasUnsavedChanges()
        requestCounter += 1
        thisRequest = requestCounter
        @setState
          request: thisRequest
          saving: @props.resource.save()
            .then (success) =>
              @setState {success}
              resetSuccess = =>
                if @state.request is thisRequest
                  @setState success: null
              setTimeout resetSuccess, @props.resetDelay
            .catch (error) =>
              @setState {error}
            .then =>
              @setState saving: null

    timeout = setTimeout saveCall, delay

    @setState
      timeout: timeout
      success: null
      error: null
