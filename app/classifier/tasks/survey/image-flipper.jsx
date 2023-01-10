import PropTypes from 'prop-types';
import React from 'react';
import Thumbnail from '../../../components/thumbnail';

const PRELOAD_STYLE = {
  height: 0,
  overflow: 'hidden',
  position: 'fixed',
  right: 0,
  width: 0
};

class ImageFlipper extends React.Component {
  constructor() {
    super();
    this.state = {
      frame: 0
    };
  }

  handleFrameChange(frame) {
    this.setState({ frame });
  }

  renderPreload() {
    return (
      <div style={PRELOAD_STYLE}>
        {this.props.images.map(image => <Thumbnail alt="loading…" src={image} key={image} width={500} />)}
      </div>
    );
  }

  render() {
    return (
      <div
        className="survey-task-image-flipper"
      >
        {this.renderPreload()}
        <Thumbnail
          alt={`Example photo ${this.state.frame + 1}`}
          aria-live="polite"
          src={this.props.images[this.state.frame]}
          className="survey-task-image-flipper-image"
          width={500}
        />
        <div className="survey-task-image-flipper-pips">
          {this.props.images.length > 1
            && this.props.images.map((image, index) => (
              <label
                key={image}
                className={`survey-task-image-flipper-pip ${index === this.state.frame ? 'active' : ''}`}
              >
                <input
                  aria-label={`View Example ${index + 1}`}
                  type="radio"
                  name="image-flipper"
                  autoFocus={index === 0}
                  checked={index === this.state.frame}
                  onChange={this.handleFrameChange.bind(this, index)}
                />
              </label>
            ))
          }
        </div>
      </div>
    );
  }
}

ImageFlipper.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string)
};

ImageFlipper.defaultProps = {
  images: []
};

export default ImageFlipper;
