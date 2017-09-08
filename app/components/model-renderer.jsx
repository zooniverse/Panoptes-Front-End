import React from 'react';
import Model from './modelling';

// function to check whether webgl is available
function webGLCompatibilityTest() {
  try {
    return !!window.WebGLRenderingContext && !!document.createElement('canvas').getContext('experimental-webgl');
  } catch (e) {
    return false;
  }
}

class ModelRenderer extends React.Component {
  constructor(props) {
    super(props);
    this.getDifference = this.getDifference.bind(this);
    this.setTexture = this.setTexture.bind(this);

    this.imgUrl = Object.values(this.props.subject.locations[0])[0];
    if (this.props.subject.locations.length < 2) {
      const im0 = this.props.subject.locations[0];
      this.props.subject.locations[1] = Object.assign({}, im0);
    }
  }
  componentDidMount() {
    if (!webGLCompatibilityTest()) {
      // TODO: is there a fallback option?
      /* eslint-disable no-console */
      console.error('WebGL is not available, aborting');
      /* eslint-enable no-console */
      return;
    }
    // component has mounted, initialise the regl canvases
    this.model = new Model(this.canvas, this.props.subject.metadata);
    // if the image has loaded
    if (this.imageLoaded) {
      // provide the differece caluculator with the image
      this.model.setBaseTexture(this.im);
      this.model.update(this.props.classification.annotations);
    } else {
      // tell the setTexture function that it should update the difference calc
      this.imageLoaded = true;
    }
  }
  componentWillReceiveProps() {
    // component has updated with new props, set the new render functions
    // check if a model has been assigned
    if (this.model !== null) {
      // if so, update the render function list to the new annotation
      window.requestAnimationFrame(this.getDifference);
    }
  }

  // don't want to re-render whenever props update
  shouldComponentUpdate() {
    if (this.imgUrl !== Object.values(this.props.subject.locations[0])[0]) {
      // we have a new subject. Refresh the model calculator
      const im0 = this.props.subject.locations[0];
      if (this.props.subject.locations.length < 2) {
        this.props.subject.locations[1] = Object.assign({}, im0);
      }
      this.model.kill();
      const metadata = this.props.subject.metadata;
      const size = (typeof metadata.imageSize) !== 'undefined' ? metadata.imageSize : [512, 512];
      this.canvas.width = size[0];
      this.canvas.height = size[1];
      this.model = new Model(this.canvas, metadata);
      this.imgUrl = Object.values(im0)[0];
      return true;
    } else {
      return false;
    }
  }
  componentWillUnmount() {
    // TODO: stop models rendering when unmounted
    this.model.kill();
    this.model = null;
  }
  getDifference() {
    // update the model from the annotation
    if (this.imageLoaded) {
      this.model.update(this.props.classification.annotations);
      window.requestAnimationFrame(() => {
        // scoring function is provided in the difference calculator
        this.props.onRender(this.model.getScore());
        const imOutType = Object.keys(this.props.subject.locations[1])[0];
        this.props.subject.locations[1][imOutType] = this.canvas.toDataURL(imOutType);
      });
    }
  }
  setTexture() {
    this.model.setBaseTexture(this.im);
    this.model.update(this.props.classification.annotations);
  }
  render() {
    const metadata = this.props.subject.metadata;
    const size = (typeof metadata.imageSize) !== 'undefined' ? metadata.imageSize : [512, 512];
    return (
      <div>
        <canvas
          width={size[0]}
          height={size[1]}
          data-style={{ backgroundColor: '#000' }}
          ref={(r) => { this.canvas = r; }}
          hidden={true}
        />
        <img
          id="im"
          src={this.imgUrl}
          onLoad={this.setTexture}
          ref={(r) => { this.im = r; }}
          alt="Galaxy"
          crossOrigin="anonymous"
          hidden={true}
        />
      </div>
    );
  }
}
/* eslint-disable react/forbid-prop-types */
ModelRenderer.propTypes = {
  classification: React.PropTypes.object.isRequired,
  subject: React.PropTypes.object.isRequired,
  onRender: React.PropTypes.func
};
/* eslint-enable react/forbid-prop-types */
export default ModelRenderer;
