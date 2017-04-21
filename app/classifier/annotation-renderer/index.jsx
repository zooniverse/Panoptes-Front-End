import React from 'react';
import ImageAnnotator from './image';

const VIEWERS = {
  image: ImageAnnotator
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
