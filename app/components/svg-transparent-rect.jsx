import PropTypes from 'prop-types';
import React from 'react';

const FILTERS = {
  invert: "url('#svg-invert-filter')"
};

const INVERT =
  `<svg style="position: fixed; right: 100%; top: 100%; visibility: hidden;">
    <defs>
      <filter id="svg-invert-filter" color-interpolation-filters="sRGB">
        <feComponentTransfer>
          <feFuncR type="table" tableValues="1 0"/>
          <feFuncG type="table" tableValues="1 0"/>
          <feFuncB type="table" tableValues="1 0"/>
        </feComponentTransfer>
      </filter>
    </defs>
  </svg>`;


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

  filterFinder() {
    if (this.props.modification.invert) {
      if (!document.getElementById('svg-invert-filter')) {
        document.body.insertAdjacentHTML('afterbegin', INVERT);
      }
      return { filter: FILTERS.invert };
    }
    return {};
  }

  render() {
    const imageProps = Object.assign({}, this.props);
    delete imageProps.modification;
    return <rect ref={(r) => { this.rect = r; }} fill="#000000" fillOpacity="0.0" {...imageProps} />;
  }
}
SVGTransparentRect.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  modification: PropTypes.object
};

SVGTransparentRect.defaultProps = {
  modification: {}
};

export default SVGTransparentRect;
