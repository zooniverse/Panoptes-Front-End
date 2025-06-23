import React from 'react';

const DEFAULT_HANDLER = () => {};

function BatchAggregations ({
  closeModal = DEFAULT_HANDLER,  // This component is contained in a <dialog>, this function closes it.
}) {
  return (
    <div className="batch-aggregations">
      <h4>Batch Aggregations</h4>

      <div>
        <button onClick={closeModal}>Close</button>
      </div>
    </div>
  );
}

export default BatchAggregations;
