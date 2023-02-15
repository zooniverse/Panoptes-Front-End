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

  function handleSelectPlayIterations (e) {
    const iterations = e.target.value;
    return workflow.update({
      'configuration.playIterations': iterations
    })
  }

  const enableSwitchingChecked = !!workflow?.configuration?.enable_switching_flipbook_and_separate
  const enableAutoplayChecked = !!workflow?.configuration?.flipbook_autoplay
  const iterations = (workflow?.configuration?.playIterations >= 0) ? workflow.configuration.playIterations : 3

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
          Allow Separate Frames View - <small>volunteers can choose flipbook or a one-column separate frames view</small>
        </label>
      </div>
    </div>
  )
}
