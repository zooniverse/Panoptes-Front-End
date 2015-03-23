React = require 'react'
ChangeListener = require './change-listener'
handleInputChange = require '../lib/handle-input-change'

module.exports = React.createClass
  displayName: 'ResourceInput'

  getDefaultProps: ->
    type: ''
    resource: null
    attribute: ''
    autoSaveDelay: 5000

  getInitialState: ->
    edited: false
    saving: false
    saved: false
    error: null

  render: ->
    <span className="resource-input">
      <ChangeListener target={@props.resource} handler={@renderComponent} />

      <span className="status">
        {if @state.error?
          <span className="form-help error">{@state.error.message}</span>
        else if @state.saving
          <span className="form-help">Saving...</span>
        else if @state.edited
          <span className="form-help">Edited</span>
        else if @state.saved
          <span className="form-help success">Saved</span>}
      </span>
    </span>

  renderComponent: ->
    component = switch @props.type
      when 'textarea' then 'textarea'
      else 'input'

    React.createElement component,
      type: @props.type
      className: @props.className
      name: @props.attribute
      value: @props.resource[@props.attribute]
      onChange: @handleChange
      onBlur: @handleBlur

  handleChange: ->
    handleInputChange.apply @props.resource, arguments

    clearTimeout @state.saveTimeout
    @setState
      edited: true
      saved: false
      error: null
      saveTimeout: setTimeout @saveResource, @props.autoSaveDelay

  handleBlur: ->
    if @state.edited
      clearTimeout @state.saveTimeout
      @saveResource()

  saveResource: ->
    @setState
      saving: true
      saved: false
      error: null

    @props.resource.save()
      .catch (error) =>
        @setState
          error: error
      .then =>
        @setState
          edited: false
          saved: true
      .then =>
        @setState saving: false
