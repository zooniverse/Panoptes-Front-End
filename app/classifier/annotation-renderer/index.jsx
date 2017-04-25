import React from 'react';
import SVGAnnotator from './svg';

function DefaultRenderer(props) {
  return (
    <div className="frame-annotator">
      {props.children}
    </div>
  );
}

DefaultRenderer.propTypes = {
  children: React.PropTypes.node
};

const VIEWERS = {
  image: SVGAnnotator
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
  children: React.PropTypes.node,
  type: React.PropTypes.string
};

export default AnnotationRenderer;
