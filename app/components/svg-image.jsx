import React from 'react';

const FILTERS = {
    invert: "url('#svg-invert-filter')",
}

const INVERT =
  '<svg style="position: fixed; right: 100%; top: 100%; visibility: hidden;">\
    <defs>\
      <filter id="svg-invert-filter">\
        <feComponentTransfer>\
          <feFuncR type="table" tableValues="1 0"/>\
          <feFuncG type="table" tableValues="1 0"/>\
          <feFuncB type="table" tableValues="1 0"/>\
        </feComponentTransfer>\
      </filter>\
    </defs>\
  </svg>';


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
  
  filterFinder() {
    if (this.props.modification.invert) {
      if (!document.getElementById('svg-invert-filter')) {
        document.body.insertAdjacentHTML('afterbegin', INVERT);
      }
      return { filter: FILTERS.invert };
    }
  }

  render() {
    return <image ref="image" xlinkHref={this.props.src} style={this.filterFinder()} {...this.props} />
  }

  fixWeirdSize() {
    const image = this.refs.image

    if (this.props.width && image.width === this.props.width) {
      image.setAttribute('width', this.props.width);
    }

    if (this.props.height && image.height === this.props.height) {
      image.setAttribute('height', this.props.height);
    }
  }
}
SVGImage.propTypes = {
  src: React.PropTypes.string.isRequired,
  height: React.PropTypes.number.isRequired,
  width: React.PropTypes.number.isRequired,
  modification: React.PropTypes.object,
};

SVGImage.defaultProps = {
  modification: {},
};

export default SVGImage;
