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
    const rect = this.rect;

    if (this.props.width && rect.width === this.props.width) {
      rect.setAttribute('width', this.props.width);
    }

    if (this.props.height && rect.height === this.props.height) {
      rect.setAttribute('height', this.props.height);
    }
  }

  render() {
    const props = Object.assign({}, this.props);
    delete props.modification;
    return <rect ref={(r) => { this.rect = r; }} fill="#000000" fillOpacity="0.0" {...props} />;
  }
}
SVGTransparentRect.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired
};

export default SVGTransparentRect;
