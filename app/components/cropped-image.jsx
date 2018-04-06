import React from 'react';
import PropTypes from 'prop-types';

class CroppedImage extends React.Component {
  constructor() {
    super();
    this.state = {
      naturalWidth: 0,
      naturalHeight: 0
    };
  }

  componentDidMount() {
    this.loadImage(this.props.src);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.src !== this.props.src) {
      this.loadImage(nextProps.src);
    }
  }

  loadImage(src) {
    const img = new Image();
    img.onload = () => {
      const { naturalWidth, naturalHeight } = img;
      this.setState({ naturalWidth, naturalHeight });
    };
    img.src = src;
  }

  render() {
    const { naturalWidth, naturalHeight } = this.state;
    const min = Math.min(naturalWidth, naturalHeight);

    let width = min;
    let height = min;

    if (this.props.aspectRatio < 1) {
      width = this.props.aspectRatio * height;
    } else if (this.props.aspectRatio > 1) {
      height = this.props.aspectRatio * width;
    }

    const x = (naturalWidth - width) / 2;
    const y = (naturalHeight - height) / 2;

    return (
      <svg
        viewBox={`${x} ${y} ${width} ${height}`}
        src={this.props.src}
        width={this.props.width}
        height={this.props.height}
        className={this.props.className}
      >
        <image
          xlinkHref={this.props.src}
          width={naturalWidth}
          height={naturalHeight}
          x="0"
          y="0"
        />
      </svg>
    );
  }
}

CroppedImage.propTypes = {
  aspectRatio: PropTypes.number,
  className: PropTypes.string,
  height: PropTypes.string,
  src: PropTypes.string,
  width: PropTypes.string
};

CroppedImage.defaultProps = {
  src: '',
  aspectRatio: NaN,
  className: '',
  height: undefined,
  width: undefined
};

export default CroppedImage;
