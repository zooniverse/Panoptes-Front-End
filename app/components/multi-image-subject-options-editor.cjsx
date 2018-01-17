React = require 'react'
createReactClass = require 'create-react-class'
ReactDOM = require 'react-dom'
ChangeListener = require './change-listener'

module.exports = createReactClass
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
    cloneMarksChecked = @props.workflow?.configuration.multi_image_clone_markers or false
    enableSwitchingChecked = @props.workflow?.configuration.enable_switching_flipbook_and_separate or false
    iterations = @props.workflow?.configuration.playIterations ? 3
    <ChangeListener target={@props.workflow}>{ =>
      <div className="multi-image-subject-layout-editor">
        <div>
          <select id="multi_image_mode" onChange={@handleSelectMode} defaultValue={mode}>
            <option value="flipbook">Show flipbook</option>
            <option value="separate">Show separate frames</option>
          </select>
        </div>
        <div>
          <input type="checkbox" id="enable_switching_flipbook_and_separate" name="enable_switching_flipbook_and_separate" checked={enableSwitchingChecked} onChange={@toggleEnableSwitching} />
          <label htmlFor="enable_switching_flipbook_and_separate">Allow users to choose flipbook or separate frames</label>
        </div>
        {if @props.workflow.configuration?.multi_image_mode is 'separate'
          <div>
            <label>Show separate frames as<input type="radio" id="multi_image_row" name="multi_image_layout" value="row" onChange={@handleSelectLayout} /></label><br/>

            <label htmlFor="multi_image_row">Single row (side by side)</label>
            <input type="radio" id="multi_image_grid2" name="multi_image_layout" value="grid2" onChange={@handleSelectLayout} />
            <label htmlFor="multi_image_grid2">Grid (2col)</label>
            <input type="radio" id="multi_image_grid3" name="multi_image_layout" value="grid3" onChange={@handleSelectLayout} />
            <label htmlFor="multi_image_grid3">Grid (3col)</label>
          </div>}
        <div>
          <input type="checkbox" id="multi_image_clone_markers" name="multi_image_clone_markers" checked={cloneMarksChecked} onChange={@toggleCloneMarks} />
          <label htmlFor="multi_image_clone_markers">Clone markers in all frames</label>
        </div>
        <div>
          <label htmlFor="flipbook_play_iterations">Flipbook Play Iterations</label> {' '}
          <input
            type="number"
            id="flipbook_play_iterations"
            placeholder="∞"
            value={iterations}
            name="flipbook_play_iterations"
            min="1"
            max="100"
            step="1"
            onChange={@toggleInfiniteLoop}
          />
          <br />
          <small>An empty iteration value denotes infinite loop.</small>
        </div>
      </div>
    }</ChangeListener>

  toggleCloneMarks: (e) ->
    @props.workflow.update
      'configuration.multi_image_clone_markers': e.target.checked

  toggleEnableSwitching: (e) ->
    @props.workflow.update
      'configuration.enable_switching_flipbook_and_separate': e.target.checked

  toggleInfiniteLoop: (e) ->
    @props.workflow.update
      'configuration.playIterations': e.target.value

  handleSelectMode: (e) ->
    mode = e.target.value
    @props.workflow.update
      'configuration.multi_image_mode': mode

  handleSelectLayout: (e) ->
    layout = e.target.value
    @props.workflow.update
      'configuration.multi_image_layout': layout
