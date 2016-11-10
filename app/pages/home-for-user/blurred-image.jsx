import React from 'react';

import style from './blurred-image.styl';
void style;

function BlurredImage(props) {
  return (
    <div className={`blurred-image__container ${props.className}`.trim()} style={props.style}>
      <div
        className="blurred-image__display"
        style={{
          backgroundImage: `url('${props.src}')`,
          backgroundPosition: props.position,
          fontSize: props.blur,
        }}
      ></div>
    </div>
  );
}

BlurredImage.propTypes = {
  className: React.PropTypes.string.isRequired,
  style: React.PropTypes.object.isRequired,
  src: React.PropTypes.string.isRequired,
  position: React.PropTypes.string.isRequired,
  blur: React.PropTypes.any,
};

BlurredImage.defaultProps = {
  className: '',
  style: {},
  src: '',
  position: '',
};

export default BlurredImage;
