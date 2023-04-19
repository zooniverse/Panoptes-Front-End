import React from 'react'

export default function FemMultiImageSubjectLayoutEditor ({
  workflow = null
}) {
  function toggleEnableSwitching (e) {
    return workflow.update({
      'configuration.enable_switching_flipbook_and_separate': e.target.checked
    })
  }

  function toggleFlipbookAutoplay (e) {
    return workflow.update({
      'configuration.flipbook_autoplay': e.target.checked
    })
  }

  function handleSelectLayout (e) {
    const layout = e.target.value
    return workflow.update({
      'configuration.multi_image_layout': layout
    })
  }

  function handleSelectPlayIterations (e) {
    const iterations = e.target.value;
    return workflow.update({
      'configuration.playIterations': iterations
    })
  }

  const enableSwitchingChecked = !!workflow?.configuration?.enable_switching_flipbook_and_separate
  const enableAutoplayChecked = !!workflow?.configuration?.flipbook_autoplay
  const iterations = workflow?.configuration?.playIterations >= 0 ? workflow.configuration.playIterations : 3
  const layout = workflow?.configuration?.multi_image_layout || 'col'

  return (
    <div className='multi-image-subject-layout-editor'>
      <span className="form-label">{`Multi-image options (Flipbook Viewer)`}</span><br/>
      <small className="form-help">Choose how to display subjects with multiple images.</small>
      <div>
        <select id='flipbook-play-iterations' onChange={handleSelectPlayIterations} value={iterations}>
          <option value=''>Infinite</option>
          <option value={3}>3</option>
          <option value={5}>5</option>
        </select>
        <label htmlFor='flipbook-play-iterations'>{' '}Play Iterations - <small>choose how many times the images loop</small></label>
      </div>
      <div>
        <label>
          <input
            type='checkbox'
            checked={enableAutoplayChecked}
            onChange={toggleFlipbookAutoplay}
            />
          Autoplay - <small>automatically loop through a subject's images when the page loads</small>
        </label>
      </div>
      <div>
        <label>
          <input
            type='checkbox'
            checked={enableSwitchingChecked}
            onChange={toggleEnableSwitching}
          />
          Allow Separate Frames View - <small>volunteers can choose flipbook or a separate frames view</small>
        </label>
      </div>

      {enableSwitchingChecked && <div>
        <br />
        <span>Show separate frames as:</span>
        <br />
        <label>
          <input
            type="radio"
            name="multi_image_layout"
            value="col"
            checked={layout === "col"}
            onChange={handleSelectLayout}
          />
          Single column - <small>all frames stacked vertically (recommended for landscape subjects, and this is the default for mobile devices)</small>
        </label>
        <br />
        <label>
          <input
            type="radio"
            name="multi_image_layout"
            value="row"
            checked={layout === "row"}
            onChange={handleSelectLayout}
          />
          Single row - <small>all frames side by side horizontally (recommended only for portrait subjects)</small>
        </label>
        <br />
        <label>
          <input
            type="radio"
            name="multi_image_layout"
            value="grid2"
            checked={layout === "grid2"}
            onChange={handleSelectLayout}
          />
          Grid (frames distributed evenly over 2 columns)
        </label>
        <br />
        <label>
          <input
            type="radio"
            name="multi_image_layout"
            value="grid3"
            checked={layout === "grid3"}
            onChange={handleSelectLayout}
          />
          Grid (frames distributed evenly over 3 columns)
        </label>
      </div>}
    </div>
  )
}
