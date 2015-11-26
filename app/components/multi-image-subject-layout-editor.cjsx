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

  componentDidMount: ->
    # Set relevant radio as checked. Must be a better way to do this, but setting defaultChecked on the radios in render() didn't seem to work
    layout = @props.workflow.configuration?.multi_image_layout or @defaultLayout
    @getDOMNode().querySelector('input[type="radio"][value="'+layout+'"]')?.defaultChecked = true;

  render: ->
    <ChangeListener target={@props.workflow}>{ =>
      <div className="multi-image-subject-layout-editor">
        <input type="radio" id="multi_image_row" name="multi_image_layout" value="row" onChange={@handleSelectLayout} />
        <label htmlFor="multi_image_row">Single row (side by side)</label>
        <input type="radio" id="multi_image_grid2" name="multi_image_layout" value="grid2" onChange={@handleSelectLayout} />
        <label htmlFor="multi_image_grid2">Grid (2col)</label>
        <input type="radio" id="multi_image_grid3" name="multi_image_layout" value="grid3" onChange={@handleSelectLayout} />
        <label htmlFor="multi_image_grid3">Grid (3col)</label>
      </div>
    }</ChangeListener>

  handleSelectLayout: (e) ->
    layout = e.target.value
    @props.workflow.update
      'configuration.multi_image_layout': layout
