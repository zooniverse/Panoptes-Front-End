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

    if (this.props.format === 'mp4') {
      return (
        <div>
          <video style={style} controls={this.props.controls} onClick={this.playVideo}>
            <source src={this.props.src} type="video/mp4" />
          </video>
        </div>
      );
    }

    if (this.props.format === 'audio') {
      return (
        <div>
          <audio style={style} controls={this.props.controls} onClick={this.playVideo}>
            <source src={this.props.src} />
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

Thumbnail.getThumbnailSrc = function getThumbnailSrc({ origin, width, height, src = '' }) {
  let srcPath = src.split('//').pop();
  srcPath = srcPath.replace('static.zooniverse.org/', '');
  return (`${origin}/${width}x${height}/${srcPath}`);
}

Thumbnail.defaultProps = {
  controls: true,
  format: 'image',
  height: MAX_THUMBNAIL_DIMENSION,
  origin: 'https://thumbnails.zooniverse.org',
  src: '',
  width: MAX_THUMBNAIL_DIMENSION
};

Thumbnail.propTypes = {
  controls: PropTypes.bool,
  format: PropTypes.string,
  height: PropTypes.number,
  origin: PropTypes.string,
  src: PropTypes.string,
  width: PropTypes.number
};
