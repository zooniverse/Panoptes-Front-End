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
  className: React.PropTypes.string,
  style: React.PropTypes.object,
  src: React.PropTypes.string,
  position: React.PropTypes.string,
  blur: React.PropTypes.any,
};

export default BlurredImage;
