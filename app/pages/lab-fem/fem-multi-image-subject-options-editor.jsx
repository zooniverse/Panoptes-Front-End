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

  function handleSelectMode (e) {
    const mode = e.target.value;
    return workflow.update({
      'configuration.multi_image_mode': mode
    })
  }

  function handleSelectPlayIterations (e) {
    const iterations = e.target.value;
    return workflow.update({
      'configuration.playIterations': iterations
    })
  }

  const mode = workflow?.configuration?.multi_image_mode || 'flipbook_and_separate'
  const enableSwitchingChecked = !!workflow?.configuration?.enable_switching_flipbook_and_separate
  const enableAutoplayChecked = !!workflow?.configuration?.flipbook_autoplay
  const iterations = (workflow?.configuration?.playIterations >= 0) ? workflow.configuration.playIterations : 3

  return (
    <div className='multi-image-subject-layout-editor'>
      <span className="form-label">{`Multi-image options (Flipbook Viewer)`}</span><br/>
      {/** Un-comment when ready to implement separate-frames-view-first in FEM */}
      {/* <div>
        <label htmlFor='multi-image-mode'>
          <small className="form-help">Choose how to display subjects with multiple images. If your subjects 
          are in a sequence, such as camera trap images, volunteers can play them in a loop using the Flipbook viewer.</small>
        </label><br/>
        <select id='multi-image-mode' onChange={handleSelectMode} value={mode}>
          <option value='flipbook'>{`Flipbook Viewer (default)`}</option>
          <option value='separate'>Separate Frames Viewer</option>
        </select>
      </div> */}
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
          Allow Separate Frames View - <small>volunteers can choose flipbook or a one-column separate frames view</small>
        </label>
      </div>
    </div>
  )
}
