import React from 'react';
import LoadingIndicator from '../components/loading-indicator';
import getSubjectLocation from '../lib/get-subject-location';
import VideoPlayer from './video-player';
import PanZoom from './pan-zoom';
import TextViewer from './text-viewer';

const SUBJECT_STYLE = { display: 'block' };
const NOOP = Function.prototype;

export default class FrameViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      frameDimensions: {
        height: 0,
        width: 0
      },
      loading: true
    };
    this.handleLoad = this.handleLoad.bind(this);
  }

  handleLoad(e) {
    const width = e.target.videoWidth || e.target.naturalWidth;
    const height = e.target.videoHeight || e.target.naturalHeight;

    this.setState({
      loading: false,
      frameDimensions: {
        height: height || 0,
        width: width || 0
      },
      viewBoxDimensions: {
        height: height || 0,
        width: width || 0,
        x: 0,
        y: 0
      }
    });

    if (this.props.onLoad) { this.props.onLoad(e, this.props.frame); }
  }

  render() {
    let type;
    let format;
    let src;
    const zoomEnabled = this.props.workflow.configuration.pan_and_zoom;
    const FrameWrapper = this.props.frameWrapper;
    ({ type, format, src } = getSubjectLocation(this.props.subject, this.props.frame));
    const frameDisplay = ((subject) => {
      switch (subject) {
        case 'image':
          return (
            <div className="subject-image-frame" >
              <img
                ref="subjectImage"
                className="subject pan-active"
                src={src}
                style={SUBJECT_STYLE}
                onLoad={this.handleLoad}
                tabIndex={0}
                onFocus={this.refs.panZoom ? this.refs.panZoom.togglePanOn : NOOP}
                onBlur={this.refs.panZoom ? this.refs.panZoom.togglePanOff : NOOP}
              />

              {this.state.loading && (
                <div className="loading-cover" style={this.constructor.overlayStyle} >
                  <LoadingIndicator />
                </div>
              )}
            </div>);
        case 'video':
          return (
            <VideoPlayer src={src} type={type} format={format} frame={this.props.frame} onLoad={this.handleLoad} />
          );
        case 'text':
          return (
            <TextViewer src={src} type={type} format={format} frame={this.props.frame} onLoad={this.handleLoad} />
          );
        default:
          return null;
      }
    })(type);

    if (FrameWrapper) {
      return (
        <PanZoom ref="panZoom" enabled={zoomEnabled} frameDimensions={this.state.frameDimensions}>
          <FrameWrapper
            frame={this.props.frame}
            naturalWidth={this.state.frameDimensions.width || 0}
            naturalHeight={this.state.frameDimensions.height || 0}
            workflow={this.props.workflow}
            subject={this.props.subject}
            classification={this.props.classification}
            annotation={this.props.annotation}
            loading={this.state.loading}
            preferences={this.props.preferences}
            modification={this.props.modification || {}}
            onChange={this.props.onChange}
          >
            {frameDisplay}
          </FrameWrapper>
        </PanZoom>
      );
    } else {
      return frameDisplay;
    }
  }
}

FrameViewer.propTypes = {
  annotation: React.PropTypes.shape(
    { id: React.PropTypes.string }
  ),
  classification: React.PropTypes.shape(
    { annotations: React.PropTypes.array }
  ),
  frame: React.PropTypes.number,
  frameWrapper: React.PropTypes.func,
  modification: React.PropTypes.object,
  onChange: React.PropTypes.func,
  onLoad: React.PropTypes.func,
  preferences: React.PropTypes.shape(
    { id: React.PropTypes.string }
  ),
  subject: React.PropTypes.shape(
    { id: React.PropTypes.string }
  ),
  workflow: React.PropTypes.shape(
    { configuration: React.PropTypes.object }
  )
};

FrameViewer.defaultProps = {
  classification: {
    annotations: []
  },
  frame: 0,
  onChange: NOOP,
  preferences: { },
  subject: {
    locations: []
  },
  workflow: {
    configuration: {}
  }
};
