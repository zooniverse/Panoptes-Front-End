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
  children: React.PropTypes.node
};

const VIEWERS = {
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
  children: React.PropTypes.node,
  type: React.PropTypes.string
};

export default AnnotationRenderer;
