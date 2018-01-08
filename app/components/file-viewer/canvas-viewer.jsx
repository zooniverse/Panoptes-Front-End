import React from 'react';
import PropTypes from 'prop-types';
import Markdown from 'markdownz';
import LoadingIndicator from '../loading-indicator';
import modelSelector from '../modelling';
import alert from '../../lib/alert';


// function to check whether webgl is available
function webGLCompatibilityTest() {
  try {
    return !!window.WebGLRenderingContext && !!document.createElement('canvas').getContext('experimental-webgl');
  } catch (e) {
    return false;
  }
}

class CanvasViewer extends React.Component {
  constructor(props) {
    super(props);
    this.onLoad = this.onLoad.bind(this);
    this.state = {
      loading: true
    };
  }
  componentDidMount() {
    // add the canvas and prep for rendering
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
    console.log('Component mounted - creating Model');
    this.createNewModel(this.props);
  }
  shouldComponentUpdate(nextProps, nextState) {
    // check if a new subject has been provided
    if (this.state.loading !== nextState.loading || this.props.src !== nextProps.src) {
      return true;
    }
    // Only re-render when annotation has changed
    // JSON is expensive, so reduce the test as much as possible
    const newAnnotation = JSON.stringify(nextProps.annotations);
    const oldAnnotation = JSON.stringify(this.props.annotations);
    if (newAnnotation !== oldAnnotation) {
      this.model.update(nextProps.annotations, nextProps.viewBoxDimensions);
    }
    // don't re-render the canvas
    return false;
  }
  componentWillUpdate(nextProps) {
    if (this.props.src !== nextProps.src) {
      console.log('Component updated - creating Model');
      this.createNewModel(nextProps);
    }
  }
  onLoad(e) {
    const loading = false;
    this.setState({ loading });
    this.props.onLoad(e);
  }
  createNewModel(props) {
    return new Promise((resolve) => {
      const Model = modelSelector(this.props.workflow);
      this.model = new Model(this.canvas, props.frame, props.subject.metadata);
      // run initial render
      resolve();
    }).then(
      () => this.onLoad({ target: {}}),
    );
  }
  // TODO: choose size from subject metadata. Handle Pan and Zoom, actually
  //       render things...
  render() {
    return (
      <div className="subject-canvas-frame" >
        <canvas
          className="subject pan-active"
          width={512}
          height={512}
          ref={(r) => { this.canvas = r; }}
          style={Object.assign({ width: '100%' }, this.props.style)}
          tabIndex={0}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
        />
        <img alt="" hidden={true} src={this.props.src} />
        <span style={{ position: 'relative', top: '-30px', paddingLeft: '10px' }}>
          SCORE HERE
        </span>
        {this.state.loading &&
          <div className="loading-cover" style={this.props.overlayStyle} >
            <LoadingIndicator />
          </div>}
      </div>
    );
  }
}

CanvasViewer.propTypes = {
  annotations: PropTypes.array,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onLoad: PropTypes.func,
  overlayStyle: PropTypes.object,
  src: PropTypes.string,
  style: PropTypes.object,
  subject: PropTypes.object,
  viewBoxDimensions: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number
  }),
  workflow: PropTypes.object
};

export default CanvasViewer;
