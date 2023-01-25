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

  const iterations = (workflow?.configuration?.playIterations >= 0)
    ? workflow.configuration.playIterations : 3

  // ChangeListener requires a function. (Or a handler)
  function render () {
    return (
      <div className='multi-image-subject-layout-editor'>
        <div>
          <select id='multi_image_mode' onChange={handleSelectMode} value={mode}>
            <option value='flipbook'>Show flipbook</option>
            <option value='separate'>Show separate frames</option>
          </select>
        </div>
        <div>
          <label>
            <input
              type='checkbox'
              checked={enableSwitchingChecked}
              onChange={toggleEnableSwitching}
            />
            Allow users to choose flipbook or separate frames
          </label>
        </div>
        {workflow?.configuration?.multi_image_mode === 'separate' ?
          <div>
            <span>
              Show separate frames as:
            </span>
            <br/>
            <label>
              <input
                type='radio'
                name='multi_image_layout'
                value='row'
                checked={layout === 'row'}
                onChange={handleSelectLayout}
              />
              Single row (side by side)
            </label>
            <br/>
            <label>
              <input
                type='radio'
                name='multi_image_layout'
                value='grid2'
                checked={layout === 'grid2'}
                onChange={handleSelectLayout}
              />
              Grid (2col)
            </label>
            <br/>
            <label>
              <input
                type='radio'
                name='multi_image_layout'
                value='grid3'
                checked={layout === 'grid3'}
                onChange={handleSelectLayout}
              />
              Grid (3col)
            </label>
          </div>
        : undefined }
        <div>
          <label>
            <input
              type='checkbox'
              checked={cloneMarksChecked}
              onChange={toggleCloneMarks}
            />
            Clone markers in all frames
          </label>
        </div>
        <div>
          <label>
            Flipbook Play Iterations {' '}
            <input
              type='number'
              placeholder='∞'
              value={iterations}
              min='1'
              max='100'
              step='1'
              onChange={toggleInfiniteLoop}
            />
          </label>
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
