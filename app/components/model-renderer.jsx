import React from 'react';
import { Markdown } from 'markdownz';
import { Model } from './modelling';
import alert from '../lib/alert';

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

    if (this.props.subject.locations.length < 2) {
      const im0 = this.props.subject.locations[0];
      this.props.subject.locations[1] = Object.assign({}, im0);
    }
    this.state = {
      imgUrl: Object.values(this.props.subject.locations[0])[0]
    };
  }
  componentDidMount() {
    if (!webGLCompatibilityTest()) {
      // TODO: Render an error message to the screen
      /* eslint-disable no-console */
      alert(
        (resolve, reject) =>
          (
            <div className="content-container">
              <Markdown className="classification-task-help">
                WebGL is required for this project, please try again using an updated browser.
              </Markdown>
              <button className="standard-button" onClick={reject}>Close</button>
            </div>
          )
      );
      /* eslint-enable no-console */
      return;
    }
    // component has mounted, initialise the regl canvas
    this.model = new Model(this.canvas, this.props.subject.metadata);
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
    return this.state.imgUrl !== Object.values(this.props.subject.locations[0])[0];
  }
  componentWillUpdate() {
    const im0 = this.props.subject.locations[0];
    if (this.props.subject.locations.length < 2) {
      this.props.subject.locations[1] = Object.assign({}, im0);
    }
    this.model.kill();
    const metadata = this.props.subject.metadata;
    this.model = new Model(this.canvas, metadata);
    this.setState({ imgUrl: Object.values(im0)[0] });
  }
  componentDidUpdate() {
    const metadata = this.props.subject.metadata;
    this.model = new Model(this.canvas, metadata);
  }
  componentWillUnmount() {
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
    window.requestAnimationFrame(
      () => this.model.update(this.props.classification.annotations)
    );
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
          src={`${this.state.imgUrl}?_${new Date().getTime()}`}
          onLoad={this.setTexture}
          ref={(r) => { this.im = r; }}
          alt="subject to classify"
          crossOrigin="anonymous"
          hidden={true}
        />
      </div>
    );
  }
}
/* eslint-disable react/forbid-prop-types */
ModelRenderer.propTypes = {
  classification: React.PropTypes.object,
  subject: React.PropTypes.object,
  onRender: React.PropTypes.func
};
/* eslint-enable react/forbid-prop-types */

// check if we're on a modelling project, and only render if we are
const ModelRendererWrapper = (props) => {
  if (props.workflow.configuration.metadata && props.workflow.configuration.metadata.type === 'modelling') {
    return <ModelRenderer {...props} />;
  } else {
    return null;
  }
};

/* eslint-disable react/forbid-prop-types */
ModelRendererWrapper.propTypes = {
  workflow: React.PropTypes.object
};
/* eslint-enable react/forbid-prop-types */

export default ModelRendererWrapper;
