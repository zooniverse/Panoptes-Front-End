import PropTypes from 'prop-types';
import React from 'react';
import { cloneDeep } from 'lodash';
import VideoPlayer from './video-player';
import AudioPlayer from './audio-player';
import TextViewer from './text-viewer';
import ImageViewer from './image-viewer';
import CanvasViewer from './canvas-viewer';

function DefaultViewer(props) {
  return (
    <p>
    Unknown file type: {props.type}
    </p>
  );
}

DefaultViewer.propTypes = {
  type: PropTypes.string
};

const VIEWERS = {
  image: ImageViewer,
  text: TextViewer,
  video: VideoPlayer,
  audio: AudioPlayer,
  application: CanvasViewer
};

function subjectViewerSelector(props) {
  if (Array.isArray(props.type)) {
    if (props.type.includes('audio')) {
      return VIEWERS.audio;
    }
    // ... add other here if neccessary
  }
  return VIEWERS[props.type] || DefaultViewer;
}

function FileViewer(props) {
  const Viewer = subjectViewerSelector(props);
  const viewerProps = {
    className: props.className,
    style: props.style,
    src: props.src,
    type: props.type,
    format: props.format,
    frame: props.frame,
    onLoad: props.onLoad,
    onFocus: props.onFocus,
    onBlur: props.onBlur
  };
  if (props.type === 'application') {
    Object.assign(
      viewerProps,
      {
        annotation: cloneDeep(props.annotation),
        annotations: props.annotations,
        subject: props.subject,
        viewBoxDimensions: props.viewBoxDimensions
      }
    );
  }
  return (
    <Viewer {...viewerProps} />
  );
}

FileViewer.propTypes = {
  annotation: PropTypes.object,
  className: PropTypes.string,
  annotations: PropTypes.arrayOf(PropTypes.object),
  format: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string
  ]),
  frame: PropTypes.number,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onLoad: PropTypes.func,
  src: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string
  ]),
  style: PropTypes.object,
  subject: PropTypes.object,
  type: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string
  ]),
  viewBoxDimensions: PropTypes.object
};

FileViewer.defaultProps = {
  annotations: []
}

export default FileViewer;
