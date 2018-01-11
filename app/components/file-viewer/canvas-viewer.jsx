import React from 'react';
import PropTypes from 'prop-types';
import Markdown from 'markdownz';
import { isMatch } from 'lodash';
import LoadingIndicator from '../loading-indicator';
import modelSelector from '../modelling';
import alert from '../../lib/alert';

class CanvasViewer extends React.Component {
  constructor(props) {
    super(props);
    this.onLoad = this.onLoad.bind(this);
    this.state = {
      loading: true,
      hasImage: false,
      hasScore: false
    };
    this.model = {};
  }
  componentDidMount() {
    // add the canvas and prep for rendering
    this.createNewModel(this.props);
  }
  componentWillUpdate(nextProps) {
    // if the subject has updated we need to re-initialise the model
    if (this.props.src !== nextProps.src) {
      this.createNewModel(nextProps);
    }
  }
  componentDidUpdate(oldProps) {
    if (
      !this.state.loading &&
      (
        !Object.keys(this.props.viewBoxDimensions).every(
          k => oldProps.viewBoxDimensions[k] === this.props.viewBoxDimensions[k]
        ) || !isMatch(oldProps.annotation, this.props.annotation)
      )
    ) {
      this.model.update(this.props.annotations, this.props.viewBoxDimensions);
    }
  }
  onLoad(e) {
    this.setState({
      loading: false,
      hasScore: this.model.hasScore || false,
      hasImage: this.model.hasImage || false
    });
    this.props.onLoad(e);
  }
  createNewModel(props) {
    this.setState({ loading: true });
    return new Promise((resolve, reject) => {
      if (props.subject.metadata && props.subject.metadata.modelling) {
        const Model = modelSelector(props.subject.metadata.modelling.filter(
          i => i.frame === this.props.frame
        )[0] || {});
        this.model = new Model(
          this.canvas,
          { frame: props.frame, metadata: props.subject.metadata, src: props.src }
        );
        if (this.model !== false) {
          resolve();
        } else {
          reject();
        }
      }
    }).then(
      () => this.onLoad({ target: {}}),
      () => alert((resolve, reject) => (
        <div className="content-container">
          <Markdown className="classification-task-help">
            Could not load model
          </Markdown>
          <button className="standard-button" onClick={reject}>Close</button>
        </div>
      )),
    );
  }
  // TODO: choose size from subject metadata. Handle Pan.
  // TODO: don't always have score, some models wouldn't want one (chart.js)
  //       this.model.hasScore? this.subject.metadata.modelling[0].hasScore?
  // TODO: does the img need to be there? this.model.hasImage
  render() {
    return (
      <div className="subject-canvas-frame" >
        <canvas
          className="subject pan-active"
          width={512}
          height={512}
          ref={(r) => { this.canvas = r; }}
          style={Object.assign({ width: '100%' }, this.props.style)}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
        />
        {
          this.state.hasImage && <img alt="" hidden={true} src={this.props.src} />
        }
        {
          this.state.hasScore &&
          <span
            ref={(r) => { this.scoreSpan = r; }}
            style={{ position: 'relative', top: '-30px', paddingLeft: '10px' }}
          >
            SCORE HERE
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

CanvasViewer.propTypes = {
  annotation: PropTypes.object,
  annotations: PropTypes.array,
  frame: PropTypes.number,
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
  })
};

CanvasViewer.defaultProps = {
  viewBoxDimensions: { height: 100, width: 100, x: 0, y: 0 }
};

export default CanvasViewer;
