React = require 'react'

module.exports = React.createClass
  
  displayName: "VideoPlayer"
  
  getInitialState: ->
    playing: false
    playbackRate: 1
  
  componentDidMount: ->
    @refs.videoScrubber?.value = 0

  componentDidUpdate: ->
    @refs.videoPlayer?.playbackRate = @state.playbackRate

  playVideo: (playing) ->
    player = @refs.videoPlayer
    return unless player?

    @setState
      playing: playing

    if playing
      player.play()
    else
      player.pause()

  setPlayRate: (e) ->
    @setState
      playbackRate: parseFloat e.target.value

  seekVideo: () ->
    player = @refs.videoPlayer
    scrubber = @refs.videoScrubber
    time = scrubber.value
    player.currentTime = time
  
  endVideo: () ->
    @setState
      playing: false

  updateScrubber: () ->
    player = @refs.videoPlayer
    scrubber = @refs.videoScrubber
    scrubber.setAttribute 'max', player.duration unless scrubber.getAttribute 'max'
    scrubber.value = player.currentTime
  
  render: ->
    <div className="subject-video-frame">
      <video className="subject" ref="videoPlayer" src={@props.src} type={"#{@props.type}/#{@props.format}"} preload="auto" onCanPlay={@props.onLoad} onEnded={@endVideo} onTimeUpdate={@updateScrubber}>
        Your browser does not support the video format. Please upgrade your browser.
      </video>
      <span className="subject-video-controls">
        <span className="subject-frame-play-controls">
          {if @state.playing
            <button type="button" className="secret-button" aria-label="Pause" onClick={@playVideo.bind this, false}>
              <i className="fa fa-pause fa-fw"></i>
            </button>
          else
            <button type="button" className="secret-button" aria-label="Play" onClick={@playVideo.bind this, true}>
              <i className="fa fa-play fa-fw"></i>
            </button>}
        </span>
        <input type="range" className="video-scrubber" ref="videoScrubber" min="0" step="any" onChange={@seekVideo} />
        <span className="video-speed">
        Speed:
          {for rate, i in [0.25, 0.5, 1]
            <label key="rate-#{i}" className="secret-button">
              <input type="radio" name="playRate#{@props.frame}" value={rate} checked={rate == @state.playbackRate} onChange={@setPlayRate} />
              <span>
                {rate}&times;
              </span>
            </label>
          }
        </span>
      </span>
      {@props.children}
    </div>