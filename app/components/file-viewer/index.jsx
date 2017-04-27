import React from 'react';
import VideoPlayer from './video-player';
import AudioPlayer from './audio-player';
import TextViewer from './text-viewer';
import ImageViewer from './image-viewer';

function DefaultViewer(props) {
  return (
    <p>
    Unknown file type: {props.type}
    </p>
  );
}

DefaultViewer.propTypes = {
  type: React.PropTypes.string
};

const VIEWERS = {
  image: ImageViewer,
  text: TextViewer,
  video: VideoPlayer,
  audio: AudioPlayer
};

function subjectViewerSelector(props) {
  if (Array.isArray(props.type)) {
    if (props.type.includes('audio')) {
      return VIEWERS.audio;
    }
    // ... add outher here if neccessary
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
  className: React.PropTypes.string,
  format: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.string
  ]),
  frame: React.PropTypes.number,
  onBlur: React.PropTypes.func,
  onFocus: React.PropTypes.func,
  onLoad: React.PropTypes.func,
  src: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.string
  ]),
  style: React.PropTypes.object,
  type: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.string
  ])
};

export default FileViewer;
