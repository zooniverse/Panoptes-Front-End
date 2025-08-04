/*
Accordion / Expandable Container
A typical accordion design.

Component Props:
- children: content to be displayed when container is expanded.
- header: content to be displayed in the container's header.
- headerAlign: "right" or "left"
- startExpanded: does the container start off expanded? (boolean)

TODO: accessibility pass
 */

import React, { useState } from 'react';

export default function ExpandableContainer ({
  children,
  header,
  headerAlign = "left",
  startExpanded = false
}) {
  const [expanded, setExpanded] = useState(startExpanded);  
  
  function onClick () {
    setExpanded(!expanded);
  }
    
  return (
    <div className={`accordion ${expanded ? 'expanded' : 'collapsed'}`}>
      <button className="header" onClick={onClick}>
        {headerAlign === 'right' && (<span className="spacer" />)}
        {header}
        {headerAlign === 'left' && (<span className="spacer" />)}
        <span className={`fa ${expanded ? 'fa-chevron-up' : 'fa-chevron-down'}`} />
      </button>
      {expanded && (
        <div className="body">
          {children}
        </div>
      )}
    </div>
  );
}