import React from 'react';

const IS_IE = 'ActiveXObject' in window;

const VideoPlayer = React.createClass({

  propTypes: {
    frame: React.PropTypes.number,
    src: React.PropTypes.string,
    type: React.PropTypes.string,
    format: React.PropTypes.string,
    onLoad: React.PropTypes.func,
    children: React.PropTypes.node,
  },

  getInitialState() {
    return {
      playing: false,
      playbackRate: 1,
    };
  },

  componentDidMount() {
    if (!!this.refs.videoScrubber) {
      this.refs.videoScrubber.value = 0;
      if (IS_IE) this.refs.videoScrubber.addEventListener('change', this.seekVideo);
    }
  },

  componentDidUpdate() {
    if (!!this.refs.videoPlayer) this.refs.videoPlayer.playbackRate = this.state.playbackRate;
  },

  componentWillUnmount() {
    if (!!this.refs.videoScrubber && IS_IE) {
      this.refs.videoScrubber.removeEventListener('change', this.seekVideo);
    }
  },

  setPlayRate(e) {
    this.setState({ playbackRate: parseFloat(e.target.value) });
  },

  playVideo(playing) {
    const player = this.refs.videoPlayer;
    if (!player) return;

    this.setState({ playing });

    if (playing) {
      player.play();
    } else {
      player.pause();
    }
  },

  seekVideo() {
    const player = this.refs.videoPlayer;
    const scrubber = this.refs.videoScrubber;
    player.currentTime = scrubber.value;
  },

  endVideo() {
    this.setState({ playing: false });
  },

  updateScrubber() {
    const player = this.refs.videoPlayer;
    const scrubber = this.refs.videoScrubber;
    if (!scrubber.getAttribute('max')) scrubber.setAttribute('max', player.duration);
    scrubber.value = player.currentTime;
  },

  renderSpeedControls(rates) {
    return rates.map((rate, i) => (
      <label key={`rate-${i}`} className="secret-button">
        <input
          type="radio"
          name={`playRate${this.props.frame}`}
          value={rate}
          checked={rate === this.state.playbackRate}
          onChange={this.setPlayRate}
        />
        <span>
          {rate}&times;
        </span>
      </label>)
    );
  },

  render() {
    const rates = [0.25, 0.5, 1];
    return (
      <div className="subject-video-frame">
        <video
          className="subject"
          ref="videoPlayer"
          src={this.props.src}
          type={`${this.props.type}/${this.props.format}`}
          preload="auto"
          onCanPlay={this.props.onLoad}
          onEnded={this.endVideo}
          onTimeUpdate={this.updateScrubber}
        >
          Your browser does not support the video format. Please upgrade your browser.
        </video>
        <span className="subject-video-controls">
          <span className="subject-frame-play-controls">
          {(this.state.playing) ?
            <button
              type="button"
              className="secret-button"
              aria-label="Pause"
              onClick={this.playVideo.bind(this, false)}
            >
              <i className="fa fa-pause fa-fw"></i>
            </button> :
            <button
              type="button"
              className="secret-button"
              aria-label="Play"
              onClick={this.playVideo.bind(this, true)}
            >
              <i className="fa fa-play fa-fw"></i>
            </button>
            }
          </span>
          <input
            type="range"
            className="video-scrubber"
            ref="videoScrubber"
            min="0"
            step="any"
            onChange={this.seekVideo}
          />
          <span className="video-speed">
          Speed: {this.renderSpeedControls(rates)}
          </span>
        </span>
        {this.props.children}
      </div>
    );
  },

});

export default VideoPlayer;
