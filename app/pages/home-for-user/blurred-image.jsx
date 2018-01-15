import PropTypes from 'prop-types';
import React from 'react';


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
  className: PropTypes.string.isRequired,
  style: PropTypes.object.isRequired,
  src: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
  blur: PropTypes.any,
};

BlurredImage.defaultProps = {
  className: '',
  style: {},
  src: '',
  position: '',
};

export default BlurredImage;