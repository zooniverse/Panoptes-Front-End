import PropTypes from 'prop-types';
import React from 'react';

class VideoPlayer extends React.Component {
  constructor(props) {
    super(props);

    this.player = null;

    this.playVideo = this.playVideo.bind(this);
    this.setPlayRate = this.setPlayRate.bind(this);

    this.state = {
      playing: false,
      playbackRate: 1
    };
  }

  componentDidMount() {
    this.player.controlsList = "nodownload"; // Non-spec option for Chrome browsers to hide the display of a download button
  }

  componentDidUpdate() {
    if (this.player) this.player.playbackRate = this.state.playbackRate;
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

  endVideo() {
    this.setState({ playing: false });
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
      </div>
    );
  }

}

VideoPlayer.propTypes = {
  format: PropTypes.string,
  frame: PropTypes.number,
  onLoad: PropTypes.func,
  showControls: PropTypes.bool,
  src: PropTypes.string,
  type: PropTypes.string
};

VideoPlayer.defaultProps = {
  showControls: true
};

export default VideoPlayer;