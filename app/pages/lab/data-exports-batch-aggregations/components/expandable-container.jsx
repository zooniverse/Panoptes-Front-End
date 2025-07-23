/*
Expandable Container
A typical accordion design.

Arguments:
- children: content to be displayed when container is expanded.
- header: content to be displayed in the container's header.
- startExpanded: does the container start off expanded? (boolean)

TODO: accessibility pass
 */

import React, { useState } from 'react';

export default function ExpandableContainer ({
  children,
  header,
  startExpanded = false
}) {
  const [expanded, setExpanded] = useState(startExpanded);  
  
  function onClick () {
    setExpanded(!expanded);
  }
    
  return (
    <div className="expandable-container">
      <div className="flex-row">
        {header}
        <span className="spacer" />
        <button onClick={onClick}>{expanded ? '🔼' : '🔽'}</button>
      </div>
      {expanded && (
        <div>
          {children}
        </div>
      )}
    </div>
  );
}