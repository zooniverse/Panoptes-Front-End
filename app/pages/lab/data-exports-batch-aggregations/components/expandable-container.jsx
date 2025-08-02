/*
Expandable Container
A typical accordion design.

Component Props:
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
    <div className={`expandable-container ${expanded ? 'expanded' : 'collapsed'}`}>
      <div className="header">
        <span onClick={onClick}>
          {header}
        </span>
        <button className="button" onClick={onClick}>
          <span className={`fa ${expanded ? 'fa-chevron-up' : 'fa-chevron-down'}`} />
        </button>
      </div>
      {expanded && (
        <div className="body">
          {children}
        </div>
      )}
    </div>
  );
}