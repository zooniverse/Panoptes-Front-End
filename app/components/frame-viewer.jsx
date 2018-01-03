import PropTypes from 'prop-types';
import React from 'react';
import getSubjectLocation from '../lib/get-subject-location';
import getSubjectLocations from '../lib/get-subject-locations';
import PanZoom from './pan-zoom';
import FileViewer from './file-viewer';


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
    const width = e.target.videoWidth || e.target.naturalWidth || 100;
    const height = e.target.videoHeight || e.target.naturalHeight || 100;

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
    const FrameWrapper = this.props.frameWrapper;
    let type;
    let format;
    let src;
    if(this.props.isAudioPlusImage){
      const subjectLocations = getSubjectLocations(this.props.subject);
      type = Object.keys(subjectLocations);
      format = Object.keys(subjectLocations).map((locationKey) => {
        return subjectLocations[locationKey][0];
      });
      src = Object.keys(subjectLocations).map((locationKey) => {
        return subjectLocations[locationKey][1];
      });
    }else{
      (({ type, format, src } = getSubjectLocation(this.props.subject, this.props.frame)));
    }
    const zoomEnabled = (
      this.props.workflow &&
      this.props.workflow.configuration.pan_and_zoom &&
      (type === 'image' || type === 'canvas' || this.props.isAudioPlusImage)
    );
    const ProgressMarker = this.props.progressMarker;
    if (FrameWrapper) {
      return (
        <PanZoom
          ref={(c) => { this.panZoom = c; }}
          enabled={zoomEnabled}
          frameDimensions={this.state.frameDimensions}
          subject={this.props.subject}
        >
          <FrameWrapper
            frame={this.props.frame}
            naturalWidth={this.state.frameDimensions.width || 0}
            naturalHeight={this.state.frameDimensions.height || 0}
            workflow={this.props.workflow}
            subject={this.props.subject}
            classification={this.props.classification}
            annotation={this.props.annotation}
            project={this.props.project}
            loading={this.state.loading}
            preferences={this.props.preferences}
            modification={this.props.modification || {}}
            onChange={this.props.onChange}
          >
            <FileViewer
              src={src}
              type={type}
              format={format}
              frame={this.props.frame}
              onLoad={this.handleLoad}
              onFocus={(this.panZoom && zoomEnabled) ? this.panZoom.togglePanOn : () => {}}
              onBlur={(this.panZoom && zoomEnabled) ? this.panZoom.togglePanOff : () => {}}
            />
          </FrameWrapper>
        </PanZoom>
      );
    } else {
      return (
        <FileViewer
          src={src}
          type={type}
          format={format}
          frame={this.props.frame}
          onLoad={this.handleLoad}
          progressListener={this.props.progressListener}
          registerProgressObject={this.props.registerProgressObject}
        />
      );
    }
  }
}

FrameViewer.propTypes = {
  annotation: PropTypes.shape(
    { id: PropTypes.string }
  ),
  classification: PropTypes.shape(
    { annotations: PropTypes.array }
  ),
  frame: PropTypes.number,
  frameWrapper: PropTypes.func,
  modification: PropTypes.object,
  onChange: PropTypes.func,
  onLoad: PropTypes.func,
  preferences: PropTypes.shape(
    { id: PropTypes.string }
  ),
  subject: PropTypes.shape(
    { id: PropTypes.string }
  ),
  workflow: PropTypes.shape(
    { configuration: PropTypes.object }
  )
};

FrameViewer.defaultProps = {
  classification: {
    annotations: []
  },
  frame: 0,
  onChange: () => {},
  preferences: { },
  subject: {
    locations: []
  },
  workflow: {
    configuration: {}
  },
};