import React from 'react';

const IS_IE = 'ActiveXObject' in window;

class VideoPlayer extends React.Component {
  constructor(props) {
    super(props);

    this.player = null;
    this.scrubber = null;

    this.endVideo = this.endVideo.bind(this);
    this.playVideo = this.playVideo.bind(this);
    this.seekVideo = this.seekVideo.bind(this);
    this.setPlayRate = this.setPlayRate.bind(this);
    this.updateScrubber = this.updateScrubber.bind(this);

    this.state = {
      playing: false,
      playbackRate: 1
    };
  }

  componentDidMount() {
    if (this.scrubber) {
      this.scrubber.value = 0;
      if (IS_IE) this.scrubber.addEventListener('change', this.seekVideo);
    }
  }

  componentDidUpdate() {
    if (this.player) this.player.playbackRate = this.state.playbackRate;
  }

  componentWillUnmount() {
    if (this.scrubber && IS_IE) {
      this.scrubber.removeEventListener('change', this.seekVideo);
    }
  }

  setPlayRate(e) {
    this.setState({ playbackRate: parseFloat(e.target.value) });
  }

  playVideo(playing) {
    const { player } = this;
    if (!player) return;

    this.setState({ playing });

    if (playing) {
      player.play();
    } else {
      player.pause();
    }
  }

  seekVideo() {
    const { player, scrubber } = this;
    player.currentTime = scrubber.value;
  }

  endVideo() {
    this.setState({ playing: false });
  }

  updateScrubber() {
    const { player, scrubber } = this;
    if (!scrubber.getAttribute('max')) scrubber.setAttribute('max', player.duration);
    scrubber.value = player.currentTime;
  }

  renderSpeedControls(rates) {
    return rates.map((rate, i) => {
      return (
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
        </label>
      );
    });
  }

  render() {
    const rates = [0.25, 0.5, 1];
    return (
      <div className="subject-video-frame">
        <video
          className="subject"
          controls={true}
          ref={(element) => { this.player = element; }}
          src={this.props.src}
          type={`${this.props.type}/${this.props.format}`}
          preload="auto"
          onCanPlay={this.props.onLoad}
          onClick={this.playVideo.bind(this, !this.state.playing)}
          onEnded={this.endVideo}
          onTimeUpdate={this.updateScrubber}
        >
          Your browser does not support the video format. Please upgrade your browser.
        </video>

        {this.props.showControls && (
          <span className="subject-video-controls">
            <span className="video-speed">
            Speed: {this.renderSpeedControls(rates)}
            </span>
          </span>
        )}
        {this.props.children}
      </div>
    );
  }

}

VideoPlayer.propTypes = {
  children: React.PropTypes.node,
  format: React.PropTypes.string,
  frame: React.PropTypes.number,
  onLoad: React.PropTypes.func,
  showControls: React.PropTypes.bool,
  src: React.PropTypes.string,
  type: React.PropTypes.string
};

VideoPlayer.defaultProps = {
  showControls: true
};

export default VideoPlayer;
