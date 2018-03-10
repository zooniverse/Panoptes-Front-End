import PropTypes from 'prop-types';
import React from 'react';

class SVGTransparentRect extends React.Component {

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
    const image = this.rect;

    if (this.props.width && image.width === this.props.width) {
      image.setAttribute('width', this.props.width);
    }

    if (this.props.height && image.height === this.props.height) {
      image.setAttribute('height', this.props.height);
    }
  }

  render() {
    const imageProps = Object.assign({}, this.props);
    delete imageProps.modification;
    return <rect ref={(r) => { this.rect = r; }} fill="#000000" fillOpacity="0.0" {...imageProps} />;
  }
}
SVGTransparentRect.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired
};

export default SVGTransparentRect;
