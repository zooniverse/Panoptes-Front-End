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