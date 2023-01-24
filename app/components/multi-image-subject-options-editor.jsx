import React, { useState, useEffect } from 'react'
import ChangeListener from './change-listener'

const defaultLayout = 'row'
const defaultMode = 'flipbook_and_separate'

export default function MultiImageSubjectLayoutEditor ({
  workflow = null
}) {

  function toggleCloneMarks (e) {
    return workflow.update({
      'configuration.multi_image_clone_markers': e.target.checked
    })
  }

  function toggleEnableSwitching (e) {
    return workflow.update({
      'configuration.enable_switching_flipbook_and_separate': e.target.checked
    })
  }

  function toggleInfiniteLoop (e) {
    return workflow.update({
      'configuration.playIterations': e.target.value
    })
  }

  function handleSelectMode (e) {
    const mode = e.target.value;
    return workflow.update({
      'configuration.multi_image_mode': mode
    })
  }

  function handleSelectLayout (e) {
    const layout = e.target.value
    return workflow.update({
      'configuration.multi_image_layout': layout
    })
  }

  const mode = workflow?.configuration?.multi_image_mode || defaultMode
  const cloneMarksChecked = !!workflow?.configuration?.multi_image_clone_markers
  const enableSwitchingChecked = !!workflow?.configuration?.enable_switching_flipbook_and_separate
  const layout = workflow?.configuration?.multi_image_layout || defaultLayout

  // TODO: figure out how to handle iterations. 0 corresponds to infinity!
  const iterations = (workflow?.configuration?.playIterations >= 0)
    ? workflow.configuration.playIterations : 3

  // ChangeListener requires a function. (Or a handler)
  function render () {
    return (
      <div className="multi-image-subject-layout-editor">
        <div>
          <select id="multi_image_mode" onChange={handleSelectMode} value={mode}>
            <option value="flipbook">Show flipbook</option>
            <option value="separate">Show separate frames</option>
          </select>
        </div>
        <div>
          <input
            type="checkbox"
            id="enable_switching_flipbook_and_separate"
            name="enable_switching_flipbook_and_separate"
            checked={enableSwitchingChecked}
            onChange={toggleEnableSwitching}
          />
          <label htmlFor="enable_switching_flipbook_and_separate">
            Allow users to choose flipbook or separate frames
            </label>
        </div>
        {workflow?.configuration?.multi_image_mode === 'separate' ?
          <div>
            <label>
              Show separate frames as
              <input
                type="radio"
                id="multi_image_row"
                name="multi_image_layout"
                value="row"
                onChange={handleSelectLayout}
              />
            </label>

            <br/>

            <label htmlFor="multi_image_row">Single row (side by side)</label>
            <input
              type="radio"
              id="multi_image_grid2"
              name="multi_image_layout"
              value="grid2"
              onChange={handleSelectLayout}
            />
            <label htmlFor="multi_image_grid2">Grid (2col)</label>
            <input
              type="radio" id="multi_image_grid3"
              name="multi_image_layout"
              value="grid3"
              onChange={handleSelectLayout}
            />
            <label htmlFor="multi_image_grid3">Grid (3col)</label>
          </div>
        : undefined }
        <div>
          <input
            type="checkbox"
            id="multi_image_clone_markers"
            name="multi_image_clone_markers"
            checked={cloneMarksChecked}
            onChange={toggleCloneMarks}
          />
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
            onChange={toggleInfiniteLoop}
          />
          <br />
          <small>An empty iteration value denotes infinite loop.</small>
        </div>
      </div>
    )
  }

  return (
    <ChangeListener target={workflow}>
      {render}
    </ChangeListener>
  )
}
