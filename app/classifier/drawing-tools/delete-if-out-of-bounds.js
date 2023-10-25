import ReactDOM from 'react-dom'

import isInBounds from '../../lib/is-in-bounds'

export default function deleteIfOutOfBounds(tool) {
  let containerBounds = null;
  try {
    containerBounds = tool?.props.getContainerRect();
  } catch (e) {
    containerBounds = tool?.props.containerRect;
  }

  try {
    const domNode = ReactDOM.findDOMNode(tool);
    let {left, top, width, height} = domNode.getBoundingClientRect();
    left += pageXOffset;
    top += pageYOffset;
    const outOfBounds = !isInBounds({left, top, width, height}, containerBounds);
    if (outOfBounds) {
      tool?.props.onDestroy()
    }
  } catch (error) {
    // uncomment this for debugging
    //console.error(error)
  }
}