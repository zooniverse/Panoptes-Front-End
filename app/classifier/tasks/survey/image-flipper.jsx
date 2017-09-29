import React from 'react';

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
        {this.props.images.map(image => <img alt="loading…" src={image} key={image} />)}
      </div>
    );
  }

  render() {
    return (
      <span className="survey-task-image-flipper">
        {this.renderPreload()}
        <img
          alt={`Frame ${this.state.frame}`}
          src={this.props.images[this.state.frame]}
          className="survey-task-image-flipper-image"
        />
        <div className="survey-task-image-flipper-pips">
          {this.props.images.length > 1 &&
            this.props.images.map((image, index) =>
              (
                <label
                  key={image}
                  className={`survey-task-image-flipper-pip ${index === this.state.frame ? 'active' : ''}`}
                >
                  <input
                    type="radio"
                    name="image-flipper"
                    autoFocus={index === 0}
                    checked={index === this.state.frame}
                    onChange={this.handleFrameChange.bind(this, index)}
                  />
                  {index + 1}
                </label>
              )
            )
          }
        </div>
      </span>
    );
  }
}

ImageFlipper.propTypes = {
  images: React.PropTypes.arrayOf(React.PropTypes.string)
};

ImageFlipper.defaultProps = {
  images: []
};

export default ImageFlipper;
