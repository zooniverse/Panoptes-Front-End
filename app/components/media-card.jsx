import React from 'react';
import PropTypes from 'prop-types';
import Thumbnail from './thumbnail';

const IMAGE_EXTENSIONS = ['gif', 'jpeg', 'jpg', 'png', 'svg'];
const VIDEO_EXTENSIONS = ['mp4'];

const MediaCard = ({ children, className, src, style }) => {
  const srcExtension = src.split('.').pop().toLowerCase();
  let renderType;

  if (IMAGE_EXTENSIONS.includes(srcExtension)) {
    renderType = <Thumbnail alt="" className="media-card-media" width={800} src={src} />;
  } else if (VIDEO_EXTENSIONS.includes(srcExtension)) {
    renderType = (
      <video
        className="media-card-media"
        autoPlay
        loop
        controls
        src={src}
      >
        <p>Your browser does not support this video format.</p>
      </video>
    );
  } else console.warn(`Not sure how to render ${src}`);

  return (
    <div className={`media-card ${className}`} style={style} >
      {src && (
        <div className="media-card-header">
          {renderType}
        </div>)}

      {children && (
        <div className="media-card-content">{children}</div>)}
    </div>
  );
};

MediaCard.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  src: PropTypes.string,
  style: PropTypes.object
};

MediaCard.defaultProps = {
  children: null,
  className: '',
  src: '',
  style: {}
};

export default MediaCard;
