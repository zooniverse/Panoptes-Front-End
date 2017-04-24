import React from 'react';
import SVGAnnotator from './svg';

const VIEWERS = {
  image: SVGAnnotator
};

function AnnotationRenderer(props) {
  const Renderer = VIEWERS[props.type];
  return (
    <Renderer {...props} >
      {props.children}
    </Renderer>
  );
}

AnnotationRenderer.propTypes = {
  children: React.PropTypes.node,
  type: React.PropTypes.string
};

export default AnnotationRenderer;
