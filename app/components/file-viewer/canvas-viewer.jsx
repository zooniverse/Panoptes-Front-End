import React from 'react';
import PropTypes from 'prop-types';
import Markdown from 'markdownz';
import { isMatch } from 'lodash';
import LoadingIndicator from '../loading-indicator';
import modelSelector from '../../features/modelling';
import alert from '../../lib/alert';

class CanvasViewer extends React.Component {
  constructor(props) {
    super(props);
    this.onLoad = this.onLoad.bind(this);
    this.setScore = this.setScore.bind(this);
    this.resizeCanvas = this.resizeCanvas.bind(this);
    this.changeCanvasStyleSize = this.changeCanvasStyleSize.bind(this);
    this.state = {
      loading: true,
      hasScore: false,
      score: null,
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
      ));
  }
  componentWillUpdate(nextProps) {
    // if the subject has updated we need to re-initialise the model
    if (this.props.src !== nextProps.src || this.props.frame !== nextProps.frame) {
      this.createNewModel(nextProps)
        .then(() => (
          this.model.update(nextProps.annotations, nextProps.viewBoxDimensions)
        ));
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
          k => oldProps.viewBoxDimensions[k] === this.props.viewBoxDimensions[k]
        ) ||
        // the old annotation is not the same as the new one
        !isMatch(oldProps.annotation, this.props.annotation)
      )
    ) {
      this.model.update(this.props.annotations, this.props.viewBoxDimensions);
    }
  }
  onLoad() {
    this.setState({
      loading: false,
      hasScore: this.model.hasScore || false
    });
  }
  setScore(s) {
    this.setState({
      hasScore: true,
      score: s
    });
  }
  resizeCanvas({ width, height }) {
    this.setState({
      canvasSize: Object.assign(
        this.state.canvasStyle,
        {
          width,
          height
        }
      )
    });
  }
  changeCanvasStyleSize({ width, height }) {
    this.setState({
      canvasStyle: {
        width,
        height
      }
    });
  }
  createNewModel(props) {
    if (!this.state.loading) this.setState({ loading: true });
    return new Promise((resolve, reject) => {
      if (props.subject.metadata && props.subject.metadata['#models']) {
        const Model = modelSelector(props.subject.metadata['#models'].filter(
          i => i.frame === props.frame
        )[0] || {});
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
            setScore: this.setScore
          }
        );
        if (this.model !== false) {
          resolve();
        } else {
          reject();
        }
      }
    })
      .catch((e) => {
        console.warn(e);
        return alert((resolve, reject) => (
          <div className="content-container">
            <Markdown className="classification-task-help">
              Could not load model
            </Markdown>
            <button className="standard-button" onClick={reject}>Close</button>
          </div>
        ));
      });
  }
  render() {
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
          this.state.hasScore && this.state.score !== null &&
          <span
            ref={(r) => { this.scoreSpan = r; }}
            className="canvas-renderer-score"
          >
            Score: {this.state.score}
          </span>
        }
        {
          this.state.loading &&
          <div className="loading-cover" style={this.props.overlayStyle} >
            <LoadingIndicator />
          </div>
        }
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
  })
};
/* eslint-enable react/forbid-prop-types */
CanvasViewer.defaultProps = {
  viewBoxDimensions: { height: 512, width: 512, x: 0, y: 0 }
};

export default CanvasViewer;
