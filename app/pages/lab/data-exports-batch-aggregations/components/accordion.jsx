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

// React 17 doesn't have useId(), so we'll need to make up our own.
function generateRandomId () {
  const numberOfDigits = 8;
  const randomNumberAsString = Math.floor(Math.random() * 10 ** numberOfDigits).toString().padStart(numberOfDigits, 0);
  return `id-${randomNumberAsString}`;
}
function useId () {
  const [id] = useState(generateRandomId);
  return id;
}

export default function Accordion ({
  children,
  header,
  headerAlign = "left",
  startExpanded = false
}) {
  const headerId = useId();
  const bodyId = useId();
  const [expanded, setExpanded] = useState(startExpanded);  
  
  function onClick () {
    setExpanded(!expanded);
  }
    
  return (
    <div
      className={`accordion ${expanded ? 'expanded' : 'collapsed'}`}
      aria-expanded={expanded ? 'true' : 'false'}
    >
      <button className="header" onClick={onClick}>
        {headerAlign === 'right' && (<span className="spacer" />)}
        {header}
        {headerId} {bodyId}
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