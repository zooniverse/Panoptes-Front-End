React = require 'react'
ChangeListener = require './change-listener'

module.exports = React.createClass
  displayName: 'MultiImageSubjectLayoutEditor'

  getDefaultProps: ->
    workflow: null

  getInitialState: ->
    saveError: null
    saveInProgress: false

  defaultLayout: 'grid2'

  render: ->
    multiImageLayout = @props.workflow.multi_image_layout ? @defaultLayout
    <ChangeListener target={@props.workflow}>{ =>
      <div className="multi-image-subject-layout-editor">
        <input type="radio" id="multi_image_row" name="multi_image_layout" value="row" onChange={@handleSelectLayout} defaultChecked={@props.workflow.config?.multi_image_layout? is 'row'} />
        <label htmlFor="multi_image_row">Single row (side by side)</label>
        <input type="radio" id="multi_image_grid2" name="multi_image_layout" value="grid2" onChange={@handleSelectLayout} defaultChecked={@props.workflow.config?.multi_image_layout? is 'grid2'} />
        <label htmlFor="multi_image_grid2">Grid (2col)</label>
        <input type="radio" id="multi_image_grid3" name="multi_image_layout" value="grid3" onChange={@handleSelectLayout} defaultChecked={@props.workflow.config?.multi_image_layout? is 'grid3'} />
        <label htmlFor="multi_image_grid3">Grid (3col)</label>
      </div>
    }</ChangeListener>

  handleSelectLayout: (e) ->
    layout = e.target.value
    @props.workflow.update
      'configuration.multi_image_layout': layout
