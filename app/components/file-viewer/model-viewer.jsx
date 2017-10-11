import React from 'react';

// function to check whether webgl is available
function webGLCompatibilityTest() {
  try {
    return !!window.WebGLRenderingContext && !!document.createElement('canvas').getContext('experimental-webgl');
  } catch (e) {
    return false;
  }
}

class ModelViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.model = new Model(this.canvas, this.props.subject.metadata);
  }
  shouldComponentUpdate() {
    if (this.state.imgUrl !== Object.values(this.props.subject.locations[0])[0]) {
      // we have a new subject. Refresh the model calculator
      const im0 = this.props.subject.locations[0];
      if (this.props.subject.locations.length < 2) {
        this.props.subject.locations[1] = Object.assign({}, im0);
      }
      this.model.kill();
      const metadata = this.props.subject.metadata;
      // const size = (typeof metadata.imageSize) !== 'undefined' ? metadata.imageSize : [512, 512];
      // this.canvas.width = size[0];
      // this.canvas.height = size[1];
      this.model = new Model(this.canvas, metadata);
      this.setState({ imgUrl: Object.values(im0)[0] });
      return true;
    } else {
      return false;
    }
  }
  componentDidUpdate() {
    this.model.kill();
    this.model = new Model(this.canvas, this.props.subject.metadata);
  }
  componentWillUnmount() {
    // TODO: stop models rendering when unmounted
    this.model.kill();
    this.model = null;
  }
  getDifference() {
    // update the model from the annotation
    this.model.update(this.props.classification.annotations);
    window.requestAnimationFrame(() => {
      // scoring function is provided in the difference calculator
      this.props.onRender(this.model.getScore());
      const imOutType = Object.keys(this.props.subject.locations[1])[0];
      this.props.subject.locations[1][imOutType] = this.canvas.toDataURL(imOutType);
    });
  }
  setTexture() {
    this.model.setBaseTexture(this.im);
    this.model.update(this.props.classification.annotations);
  }
  render() {
    if (webGLCompatibilityTest()) {
      return (<canvas height="512" width="512" />);
    } else {
      return (
        <p>WebGL is not available, please try a different browser (We reccomend Chrome)</p>
      );
    }
  }
}

/* eslint-disable react/forbid-prop-types */
ModelViewer.propTypes = {
  classification: React.PropTypes.object,
  subject: React.PropTypes.object,
  onRender: React.PropTypes.function
};
/* eslint-enable react/forbid-prop-types */

export default ModelViewer;
