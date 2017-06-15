import React from 'react';
import AudioPlayer from './audio-player'
import SVGRenderer from '../../classifier/annotation-renderer/svg';

class AudioPlayerWithTraceImage extends React.Component {
  constructor(props) {
    super(props);

    this.player = null;
    this.svg = null;
    this.traceImage = null;

    // this.playAudio = this.player.playAudio.bind(this);
    // this.setSVG = this.svg.setSVG.bind(this);

    this.state = {
      audioPlaying: false
    };
  }

  render() {
    return (
      <div>
        <AudioPlayer
          children={this.props.children}
          format={this.props.audioFormat}
          frame={this.props.frame}
          onLoad={this.props.onLoad}
          showControls={true}
          src={this.props.src}
          type={this.props.audioType}
        >
        </AudioPlayer>
        <div width='500px' height='500px'>
        <SVGRenderer
          subject={{locations : [{'image/png': 'https://panoptes-uploads.zooniverse.org/staging/subject_location/021f7ebe-7a07-43ca-ac0f-f34d3f8a68f7.png'}]}}
          frame={0}
          viewBoxDimensions={{x:45, y:45, width:500, height:500}}
          naturalWidth={500}
          naturalHeight={500}
          annotation={{task:null}}
          classification={{annotations:[]}}
          workflow={{tastks:[]}}
          />
      </div>

    </div>
    );
  }

}

AudioPlayerWithTraceImage.propTypes = {
  children: React.PropTypes.node,
  audioFormat: React.PropTypes.string,
  traceImageFormat: React.PropTypes.string,
  frame: React.PropTypes.number,
  onLoad: React.PropTypes.func,
  showControls: React.PropTypes.bool,
  audioSrc: React.PropTypes.string,
  src: React.PropTypes.string,
  traceImageSrc: React.PropTypes.string,
  audioType: React.PropTypes.string,
  traceImageType: React.PropTypes.string
};

AudioPlayerWithTraceImage.defaultProps = {
  showControls: true,
};

export default AudioPlayerWithTraceImage;
