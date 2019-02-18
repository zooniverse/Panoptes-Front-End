import PropTypes from 'prop-types';
import React from 'react';

class SVGImage extends React.Component {
  constructor() {
    super();
    this.fixWeirdSize = this.fixWeirdSize.bind(this);
  }

  componentDidMount() {
    this.fixWeirdSize();
  }

  componentDidUpdate() {
    this.fixWeirdSize();
  }

  fixWeirdSize() {
    const image = this.refs.image;

    if (this.props.width && image && image.width === this.props.width) {
      image.setAttribute('width', this.props.width);
    }

    if (this.props.height && image && image.height === this.props.height) {
      image.setAttribute('height', this.props.height);
    }
  }

  render() {
    const imageProps = Object.assign({}, this.props);
    delete imageProps.modification;
    return <image ref="image" xlinkHref={this.props.src} {...imageProps} />;
  }
}
SVGImage.propTypes = {
  src: PropTypes.string.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired
};

export default SVGImage;
