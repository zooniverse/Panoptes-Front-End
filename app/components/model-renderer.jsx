import React from 'react';
import { model, differenceModel } from './model';

const size = [512, 512];
// function to check whether webgl is available

function webGLCompatibilityTest() {
    try {
        return !!window.WebGLRenderingContext && !!document.createElement('canvas').getContext('experimental-webgl');
    } catch(e) {
        return false;
    }
}

class ModelRenderer extends React.Component {
  constructor(props) {
    super(props)
    this.getDifference = this.getDifference.bind(this);
    this.setTexture = this.setTexture.bind(this);

    if (this.props.subject.locations.length < 2) {
      const im0 = this.props.subject.locations[0];
      this.props.subject.locations[1] = Object.assign({}, im0);
    }
  }

  // don't want to re-render whenever props update
  shouldComponentUpdate() { return false; }

  componentWillReceiveProps(nextProps) {
    // we need two images as subjects - one for the original galaxy and one for
    // the difference between the galaxy and our model
    if (this.props.subject.locations.length < 2) {
      const im0 = this.props.subject.locations[0];
      this.props.subject.locations[1] = Object.assign({}, im0);
    }
    // component has updated with new props, set the new render functions
    // check if a model has been assigned
    if (this.model !== null) {
      // if so, update the render function list to the new annotation
      window.requestAnimationFrame(this.getDifference);
    }
  }
  getDifference() {
    // update the model from the annotation
    if (this.imageLoaded) {
      this.model.update(this.props.classification.annotations);
      this.diffModel.update();
      window.requestAnimationFrame(() => {
        // scoring function is provided in the difference calculator
        this.props.onRender(this.diffModel.getScore());
        const imOutType = Object.keys(this.props.subject.locations[1])[0];
        this.props.subject.locations[1][imOutType] = this.backgroundCanvas.toDataURL(imOutType);
      });
    }
  }
  setTexture() {
    if (this.imageLoaded) {
      this.diffModel.setBaseTexture(this.im);
      this.diffModel.update();
    } else {
      this.imageLoaded = true;
    }
  }
  componentDidMount() {
    if (!webGLCompatibilityTest()) {
      // TODO: is there a fallback option?
      console.error('WebGL is not available, aborting');
      return;
    }
    // component has mounted, initialise the regl canvases
    this.model = new model(this.canvas);
    // send across the initial annotation
    this.model.update(this.props.classification.annotations);

    // initialise the backgroundRegl to do difference calculation
    this.diffModel = new differenceModel(this.backgroundCanvas);
    // provide it with the regl for the model we just created
    this.diffModel.setModelRegl(this.model.getRegl());
    // wait a frame then tell it to update
    window.requestAnimationFrame(() => this.diffModel.update());

    // if the image has loaded
    if (this.imageLoaded) {
      // provide the differece caluculator with the image
      this.diffModel.setBaseTexture(this.im);
      this.diffModel.update();
    } else {
      // tell the setTexture function that it should update the difference calc
      this.imageLoaded = true;
    }
  }
  componentWillUnmount() {
    // TODO: stop models rendering when unmounted
    this.model.kill();
    this.model = null;
  }

  render() {
    const size = typeof(this.props.subject.metadata.imageSize) !== 'undefined' ?
      this.props.subject.metadata.imageSize :
      [512, 512];
    const imgUrl = Object.values(this.props.subject.locations[0])[0]
    return (
      <div>
        <canvas
          width={size[0]}
          height={size[1]}
          data-style={{ backgroundColor: '#000' }}
          ref={r => {this.canvas = r }}
          hidden
        />
        <canvas
          width={size[0]}
          height={size[1]}
          data-style={{ backgroundColor: '#000' }}
          ref={r => { this.backgroundCanvas = r }}
          hidden
        />
        <img
          id="im"
          src={imgUrl}
          onLoad={this.setTexture}
          ref={r => { this.im = r }}
          alt="Galaxy"
          crossOrigin=""
          hidden
        />
      </div>
    );
  }
}

ModelRenderer.propTypes = {
  classification: React.PropTypes.object.isRequired,
  subject: React.PropTypes.object.isRequired,
  onRender: React.PropTypes.func,
  workflow: React.PropTypes.object,
}

export default ModelRenderer;
