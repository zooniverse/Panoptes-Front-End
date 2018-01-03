import PropTypes from 'prop-types';
import React from 'react';
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
  canvas: CanvasViewer
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

  return (
    <Viewer
      className={props.className}
      style={props.style}
      src={props.src}
      type={props.type}
      format={props.format}
      frame={props.frame}
      onLoad={props.onLoad}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
    />
  );
}

FileViewer.propTypes = {
  className: PropTypes.string,
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
  type: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string
  ])
};

export default FileViewer;