React = require 'react'
ReactDOM = require 'react-dom'
ChangeListener = require './change-listener'

module.exports = React.createClass
  displayName: 'MultiImageSubjectLayoutEditor'

  getDefaultProps: ->
    workflow: null

  getInitialState: ->
    saveError: null
    saveInProgress: false

  defaultLayout: 'row'
  defaultMode: 'flipbook_and_separate'

  componentDidMount: ->
    @updateRadios()

  componentWillReceiveProps: (nextProps) ->
    if nextProps.workflow
      @updateRadios()

  # Set relevant layout radio as checked. Must be a better way to do this, but setting defaultChecked on the radios in render() didn't seem to work
  updateRadios: () ->
    layout = @props.workflow.configuration?.multi_image_layout or @defaultLayout
    ReactDOM.findDOMNode(this).querySelector('input[type="radio"][value="'+layout+'"]')?.defaultChecked = true;

  render: ->
    mode = @props.workflow.configuration?.multi_image_mode or @defaultMode
    <ChangeListener target={@props.workflow}>{ =>
      <div className="multi-image-subject-layout-editor">
        <div>
          <select id="multi_image_mode" onChange={@handleSelectMode} defaultValue={mode}>
            <option value="flipbook">Show flipbook</option>
            <option value="separate">Show separate frames</option>
            <option value="flipbook_and_separate">Allow users to choose flipbook or separate frames</option>
          </select>
        </div>
        {if @props.workflow.configuration?.multi_image_mode is 'separate' or @props.workflow.configuration?.multi_image_mode is 'flipbook_and_separate'
          <div>
            <label>Show separate frames as</label><br/>
            <input type="radio" id="multi_image_row" name="multi_image_layout" value="row" onChange={@handleSelectLayout} />
            <label htmlFor="multi_image_row">Single row (side by side)</label>
            <input type="radio" id="multi_image_grid2" name="multi_image_layout" value="grid2" onChange={@handleSelectLayout} />
            <label htmlFor="multi_image_grid2">Grid (2col)</label>
            <input type="radio" id="multi_image_grid3" name="multi_image_layout" value="grid3" onChange={@handleSelectLayout} />
            <label htmlFor="multi_image_grid3">Grid (3col)</label>
          </div>}
      </div>
    }</ChangeListener>

  handleSelectMode: (e) ->
    mode = e.target.value
    @props.workflow.update
      'configuration.multi_image_mode': mode

  handleSelectLayout: (e) ->
    layout = e.target.value
    @props.workflow.update
      'configuration.multi_image_layout': layout
