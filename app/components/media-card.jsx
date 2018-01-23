import React from 'react';

const IMAGE_EXTENSIONS = ['gif', 'jpeg', 'jpg', 'png', 'svg'];
const VIDEO_EXTENSIONS = ['mp4'];

const MediaCard = ({ children, className, src, style }) => {
  const srcExtension = src.split('.').pop().toLowerCase();
  let renderType;

  if (IMAGE_EXTENSIONS.includes(srcExtension)) {
    renderType = <img alt="" className="media-card-media" src={src} />;
  } else if (VIDEO_EXTENSIONS.includes(srcExtension)) {
    renderType = (
      <video className="media-card-media" src={src}>
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
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  src: React.PropTypes.string,
  style: React.PropTypes.object
};

MediaCard.defaultProps = {
  className: '',
  src: '',
  style: {}
};

export default MediaCard;
