import { useState } from 'react';
import PropTypes from 'prop-types';

function DropTarget({
  activeDragItem = -1,
  moveStep = () => {},
  setActiveDragItem = () => {},
  targetIndex = 0
}) {
  const [active, setActive] = useState(false);

  function onDragEnter(e) {
    const from = activeDragItem;
    const to = (from < targetIndex) ? targetIndex - 1 : targetIndex; 
    setActive(from !== to);
    e.preventDefault(); // Prevent default, to ensure onDrop works.
  }

  function onDragLeave(e) {
    setActive(false);
    e.preventDefault();  // Probably unnecessary for onDrop, but oh well
  }

  function onDragOver(e) {
    e.preventDefault(); // Prevent default, to ensure onDrop works.
  }

  function onDrop(e) {
    const from = parseInt(e.dataTransfer.getData('text/plain')) || 0;
    const to = (from < targetIndex) ? targetIndex - 1 : targetIndex;
    moveStep(from, to);
    setActive(false);
    setActiveDragItem(-1);
    e.preventDefault();
  }

  return (
    <div
      className={`step-drop-target ${active ? 'active' : ''}`}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    ></div>
  );
}

DropTarget.propTypes = {
  activeDragItem: PropTypes.number,
  moveStep: PropTypes.func,
  setActiveDragItem: PropTypes.func,
  targetIndex: PropTypes.number
}

export default DropTarget;
