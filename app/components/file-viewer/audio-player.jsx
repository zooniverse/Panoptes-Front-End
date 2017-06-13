import React from 'react';

class AudioPlayer extends React.Component {
  constructor(props) {
    super(props);

    this.player = null;

    this.playAudio = this.playAudio.bind(this);

    this.state = {
      playing: false
    };
  }

  componentDidMount() {
    this.player.controlsList = "nodownload"; // Non-spec option for Chrome browsers to hide the display of a download button
  }

  componentDidUpdate() {
  }

  playAudio(playing) {
    const { player } = this;
    if (!player) return;

    this.setState({ playing });

    if (playing) {
      player.play();
    } else {
      player.pause();
    }
  }

  endAudio() {
    this.setState({ playing: false });
  }

  render() {
    // const rates = [0.25, 0.5, 1];
    return (
      <div className="subject-audio-frame">
        <audio
          className="subject"
          controls={true}
          ref={(element) => { this.player = element; }}
          src={this.props.src}
          type={`${this.props.type}/${this.props.format}`}
          preload="auto"
          onCanPlay={this.props.onLoad}
          onClick={this.playAudio.bind(this, !this.state.playing)}
          onEnded={this.endAudio}
        >
          Your browser does not support the audio format. Please upgrade your browser.
        </audio>

        {this.props.showControls}
        {this.props.children}
      </div>
    );
  }

}

AudioPlayer.propTypes = {
  children: React.PropTypes.node,
  format: React.PropTypes.string,
  frame: React.PropTypes.number,
  onLoad: React.PropTypes.func,
  showControls: React.PropTypes.bool,
  src: React.PropTypes.string,
  type: React.PropTypes.string
};

AudioPlayer.defaultProps = {
  showControls: true
};

export default AudioPlayer;
