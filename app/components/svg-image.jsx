import React, {PropTypes} from 'react';


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

  render() {
    return <image ref="image" xlinkHref={this.props.src} {...this.props} />
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
  src: PropTypes.string.isRequired
}

export default SVGImage;
