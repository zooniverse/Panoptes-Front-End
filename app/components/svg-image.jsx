import React from 'react';

class SVGImage extends React.Component {

  constructor() {
    super();
    this.setHref = this.setHref.bind(this);
    this.fixWeirdSize = this.fixWeirdSize.bind(this);
  }

  componentDidMount() {
    this.setHref();
    this.fixWeirdSize();
  }

  componentDidUpdate() {
    this.setHref();
    this.fixWeirdSize();
  }

  render() {
    return <image ref="image" {...this.props} />
  }

  setHref() {
    const image = this.refs.image;
    image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', this.props.src);
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

export default SVGImage;
