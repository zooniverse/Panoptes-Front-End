import React from 'react';
import VideoPlayer from './video-player';
import TextViewer from './text-viewer';
import ImageViewer from './image-viewer';

const VIEWERS = {
  image: ImageViewer,
  text: TextViewer,
  video: VideoPlayer
};

function FileViewer(props) {
  const Viewer = VIEWERS[props.type];
  return (
    <Viewer
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
  format: React.PropTypes.string,
  frame: React.PropTypes.number,
  onBlur: React.PropTypes.func,
  onFocus: React.PropTypes.func,
  onLoad: React.PropTypes.func,
  src: React.PropTypes.string,
  type: React.PropTypes.string
};

export default FileViewer;
