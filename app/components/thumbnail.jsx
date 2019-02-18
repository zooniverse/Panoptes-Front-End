import PropTypes from 'prop-types';
import React from 'react';

const MAX_THUMBNAIL_DIMENSION = 999;

export default class Thumbnail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      failed: false
    };

    this.playVideo = this.playVideo.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  handleError() {
    if (!this.state.failed) {
      this.setState({ failed: true });
    }
  }

  playVideo(e) {
    if (e.target.paused) {
      e.target.play();
    } else {
      e.target.pause();
    }
  }

  render() {
    const src = this.state.failed ? this.props.src : Thumbnail.getThumbnailSrc(this.props);

    const dimensions = {
      width: null,
      height: null
    };

    const style = {
      maxWidth: this.props.width,
      maxHeight: this.props.height
    };

    if (this.props.type === 'video') {
      return (
        <div>
          <video style={style} controls={this.props.controls} onClick={this.playVideo}>
            <source src={this.props.src} type={`video/${this.props.format}`} />
          </video>
        </div>
      );
    }

    if (this.props.type === 'audio') {
      return (
        <div>
          <audio style={style} controls={this.props.controls} onClick={this.playVideo}>
            <source src={this.props.src} type={`audio/${this.props.format}`} />
          </audio>
        </div>
      );
    }

    return (
      <div  style={style}>
        <img alt="" {...this.props} src={src} {...dimensions} onError={this.handleError} />
      </div>
    );
  }
}

Thumbnail.getThumbnailSrc = function getThumbnailSrc({ origin, width, height, src }) {
  if (!src) {
    return undefined;
  }
  if (src.includes('.gif')) return src;
  let srcPath = src.split('//').pop();
  srcPath = srcPath.replace('static.zooniverse.org/', '');
  return (`${origin}/${width}x${height}/${srcPath}`);
}

Thumbnail.defaultProps = {
  controls: true,
  format: '',
  height: MAX_THUMBNAIL_DIMENSION,
  origin: 'https://thumbnails.zooniverse.org',
  src: '',
  type: 'image',
  width: MAX_THUMBNAIL_DIMENSION
};

Thumbnail.propTypes = {
  controls: PropTypes.bool,
  format: PropTypes.string,
  height: PropTypes.number,
  origin: PropTypes.string,
  src: PropTypes.string,
  type: PropTypes.string,
  width: PropTypes.number
};
