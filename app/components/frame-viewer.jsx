import React from 'react';
import getSubjectLocation from '../lib/get-subject-location';
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
    const { type, format, src } = getSubjectLocation(this.props.subject, this.props.frame);
    const zoomEnabled = this.props.workflow && this.props.workflow.configuration.pan_and_zoom && type === 'image';

    if (FrameWrapper) {
      return (
        <PanZoom ref={(c) => { this.panZoom = c; }} enabled={zoomEnabled} frameDimensions={this.state.frameDimensions}>
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
        />
      );
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
  onChange: () => {},
  preferences: { },
  subject: {
    locations: []
  },
  workflow: {
    configuration: {}
  }
};
