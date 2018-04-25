import React from 'react';
import PropTypes from 'prop-types';
import { isMatch } from 'lodash';
import LoadingIndicator from '../loading-indicator';
import modelSelector from '../../features/modelling';
import alert from '../../lib/alert';

class CanvasViewer extends React.Component {
  constructor(props) {
    super(props);
    this.onLoad = this.onLoad.bind(this);
    this.setMessage = this.setMessage.bind(this);
    this.resizeCanvas = this.resizeCanvas.bind(this);
    this.changeCanvasStyleSize = this.changeCanvasStyleSize.bind(this);
    this.modelDidError = this.modelDidError.bind(this);
    this.state = {
      loading: true,
      modelFailedToLoad: false,
      hasMessage: false,
      modelErrorMessage: null,
      message: null,
      canvasSize: {
        width: 512,
        height: 512
      },
      canvasStyle: {
        width: 'auto',
        height: 'auto'
      }
    };
    this.model = {};
  }
  componentDidMount() {
    // add the canvas and prep for rendering
    this.createNewModel(this.props)
      .then(() => (
        this.model.update(this.props.annotations, this.props.viewBoxDimensions)
      ))
      .catch((e) => {
        console.warn(e);
        this.setState({ modelFailedToLoad: true });
      });
  }
  componentWillUpdate(nextProps) {
    // if the subject has updated we need to re-initialise the model
    if (this.props.src !== nextProps.src || this.props.frame !== nextProps.frame) {
      this.createNewModel(nextProps)
        .then(() => (
          this.model.update(nextProps.annotations, nextProps.viewBoxDimensions)
        ))
        .catch((e) => {
          console.warn(e);
          this.setState({ modelFailedToLoad: true });
        });
    }
  }
  componentDidUpdate(oldProps) {
    // The component has just updated. We now trigger a render!
    // If we're not loading, we have zoomed/panned or the new annotation is
    // different from the old one, update (render) the model!
    if (
      !this.state.loading &&
      (
        // old view box is not the same as new view box
        !Object.keys(this.props.viewBoxDimensions).every(
          key => oldProps.viewBoxDimensions[key] === this.props.viewBoxDimensions[key]
        ) ||
        // the old annotation is not the same as the new one
        !isMatch(oldProps.annotation, this.props.annotation)
      )
    ) {
      this.model.update(this.props.annotations, this.props.viewBoxDimensions);
    }
  }
  onLoad({ width, height }) {
    this.setState({
      loading: false
    }, () => this.props.onLoad({
      target: {
        naturalWidth: width,
        naturalHeight: height
      }
    }));
  }
  /* eslint-disable class-methods-use-this */
  getModelForFrame(metadata, frame) {
    const model = metadata['#models'].filter(
      models => models.frame === frame
    );
    // check if model is an empty (shouln't be)
    return modelSelector(model[0] || {});
  }
  /* eslint-enable class-methods-use-this */
  setMessage(message) {
    this.setState({
      hasMessage: true,
      message
    });
  }
  modelDidError({ modelErrorMessage }) {
    this.setState({ modelFailedToLoad: true, modelErrorMessage });
  }
  resizeCanvas({ width, height }) {
    const canvasSize = { width, height };
    this.setState({ canvasSize });
  }
  changeCanvasStyleSize({ width, height }) {
    const canvasStyle = { width, height };
    this.setState({ canvasStyle });
  }
  createNewModel(props) {
    if (!this.state.loading) this.setState({ loading: true });
    return new Promise((resolve, reject) => {
      if (props.subject.metadata && props.subject.metadata['#models']) {
        const Model = this.getModelForFrame(props.subject.metadata, props.frame);
        this.model = new Model(
          this.canvas,
          // pass metadata for model
          {
            frame: props.frame,
            metadata: props.subject.metadata,
            src: props.src,
            sizing: props.viewBoxDimensions
          },
          // pass event handlers
          {
            onLoad: this.onLoad,
            resizeCanvas: this.resizeCanvas,
            changeCanvasStyleSize: this.changeCanvasStyleSize,
            setMessage: this.setMessage,
            modelDidError: this.modelDidError
          }
        );
        if (this.model !== false) {
          resolve();
        } else {
          reject();
        }
      }
    });
  }
  render() {
    if (this.state.modelFailedToLoad) {
      return (
        <div>
          <h3>Whoops!</h3>
          <p>{this.state.modelErrorMessage || 'Something went wrong and we can\'t show this image'}</p>
        </div>
      );
    }
    return (
      <div className="subject-canvas-frame" >
        <canvas
          className="subject pan-active"
          width={this.state.canvasSize.width}
          height={this.state.canvasSize.height}
          ref={(r) => { this.canvas = r; }}
          style={Object.assign({}, this.props.style, this.state.canvasStyle)}
        />
        {
          this.state.hasMessage && this.state.message !== null &&
          <span
            className="canvas-renderer-message"
          >
            {this.state.message}
          </span>
        }
        {this.state.loading &&
          <div className="loading-cover" style={this.props.overlayStyle} >
            <LoadingIndicator />
          </div>}
      </div>
    );
  }
}
/* eslint-disable react/forbid-prop-types */
CanvasViewer.propTypes = {
  annotation: PropTypes.object,
  annotations: PropTypes.array,
  frame: PropTypes.number,
  overlayStyle: PropTypes.object,
  src: PropTypes.string,
  style: PropTypes.object,
  /* eslint-disable react/no-unused-prop-types */
  subject: PropTypes.object,
  /* eslint-enable react/no-unused-prop-types */
  viewBoxDimensions: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number
  }),
  onLoad: PropTypes.func
};
/* eslint-enable react/forbid-prop-types */
CanvasViewer.defaultProps = {
  viewBoxDimensions: { height: 512, width: 512, x: 0, y: 0 }
};

export default CanvasViewer;
