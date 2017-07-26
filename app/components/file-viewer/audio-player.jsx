import React from 'react';
import ImageViewer from './image-viewer';
import ProgressIndicator from './progress-indicator';

class AudioPlayer extends React.Component {
  constructor(props) {
    super(props);

    this.player = null;

    this.endAudio = this.endAudio.bind(this);
    this.playAudio = this.playAudio.bind(this);
    this.onAudioLoad = this.onAudioLoad.bind(this);
    this.updateProgress = this.updateProgress.bind(this);

    this.state = {
      playing: false,
      progressPosition: 0,
      trackDuration: 0
    };
  }

  componentDidMount() {
    this.player.controlsList = 'nodownload'; // Non-spec option for Chrome browsers to hide the display of a download button
  }

  onAudioLoad(e) {
    e.stopPropagation();
    this.state.trackDuration = this.player.duration;
  }

  imageSrc() {
    return Array.isArray(this.props.type)
      ? this.props.src[this.props.type.indexOf('image')]
      : false;
  }

  audioSrc() {
    return Array.isArray(this.props.type)
      ? this.props.src[this.props.type.indexOf('audio')]
      : this.props.src;
  }

  imageTypeString() {
    return Array.isArray(this.props.type)
      ? `image/${this.props.format[this.props.type.indexOf('image')]}`
      : false;
  }

  audioTypeString() {
    return Array.isArray(this.props.type)
      ? `audio/${this.props.format[this.props.type.indexOf('audio')]}`
      : `audio/${this.props.format}`;
  }

  imageFormatString() {
    return Array.isArray(this.props.type)
      ? this.props.format[this.props.type.indexOf('image')]
      : false;
  }

  audioFormatString() {
    return Array.isArray(this.props.type)
      ? this.props.format[this.props.type.indexOf('audio')]
      : this.props.format;
  }

  updateProgress() {
    this.setState({ progressPosition: this.player.currentTime });
  }

  playAudio(playing) {
    this.setState({ playing });

    if (playing) {
      this.player.play();
    } else {
      this.player.pause();
    }
  }

  endAudio() {
    this.setState({ playing: false });
  }

  renderProgressMarker() {
    return (
      <ProgressIndicator
        progressPosition={this.state.progressPosition}
        progressRange={[0, this.state.trackDuration]}
        naturalWidth={100}
        naturalHeight={100}
      />
    );
  }

  render() {
    const imageSrc = this.imageSrc();
    let imageElement = null;
    if (imageSrc) {
      imageElement = (
        <div>
          {this.renderProgressMarker()}
          <div className="audio-image-component">
            <ImageViewer
              src={imageSrc}
              type={this.imageTypeString()}
              format={this.imageFormatString()}
              frame={this.props.frame}
              onLoad={this.props.onLoad}
              onFocus={this.props.onFocus}
              onBlur={this.props.onBlur}
            />
          </div>
        </div>
      );
    }
    return (
      <div>
        <div>
          {imageElement}
        </div>
        <div className="audio-player-component">
          <audio
            className="subject"
            controls={true}
            ref={(element) => { this.player = element; }}
            src={this.audioSrc()}
            type={this.audioTypeString()}
            preload="auto"
            onCanPlay={this.onAudioLoad}
            onEnded={this.endAudio}
            onTimeUpdate={this.updateProgress}
          >
            Your browser does not support the audio format. Please upgrade your browser.
          </audio>

          {this.props.children}
        </div>
      </div>
    );
  }

}

AudioPlayer.propTypes = {
  children: React.PropTypes.node,
  format: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.string]),
  frame: React.PropTypes.number,
  onLoad: React.PropTypes.func,
  onFocus: React.PropTypes.func,
  onBlur: React.PropTypes.func,
  src: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.string]),
  type: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.string])
};

AudioPlayer.defaultProps = {};

export default AudioPlayer;
