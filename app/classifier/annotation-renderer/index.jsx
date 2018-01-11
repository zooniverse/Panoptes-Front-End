import PropTypes from 'prop-types';
import React from 'react';
import SVGRenderer from './svg';
import TextRenderer from './text';

function DefaultRenderer(props) {
  return (
    <div className="frame-annotator">
      {props.children}
    </div>
  );
}

DefaultRenderer.propTypes = {
  children: PropTypes.node
};

const VIEWERS = {
  audio: SVGRenderer,
  application: SVGRenderer,
  image: SVGRenderer,
  text: TextRenderer
};

function AnnotationRenderer(props) {
  const Renderer = VIEWERS[props.type] || DefaultRenderer;

  return (
    <Renderer {...props} >
      {props.children}
    </Renderer>
  );
}

AnnotationRenderer.propTypes = {
  children: PropTypes.node,
  type: PropTypes.string
};

export default AnnotationRenderer;