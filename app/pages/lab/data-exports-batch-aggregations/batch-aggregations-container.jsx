import React, { useRef } from 'react';
import BatchAggregations from './batch-aggregations.jsx';

function BatchAggregationsExport ({ project, user }) {
  const batchAggregationsDialog = useRef(null);

  function toggleDialog () {
    if (batchAggregationsDialog?.current?.open) {
      closeModal();
    } else {
      openModal();
    }
  }

  function openModal () {
    batchAggregationsDialog?.current?.showModal();
  }

  function closeModal () {
    batchAggregationsDialog?.current?.close();
  }

  // DEBUG: open modal for development's sake
  setTimeout(openModal, 100)

  return (
    <div className="batch-aggregations-container">
      <button onClick={toggleDialog}>
        Aggregate My Results
      </button>
      <dialog ref={batchAggregationsDialog}>
        <BatchAggregations
          closeModal={closeModal}
          project={project}
          user={user}
        />
      </dialog>
    </div>
  );
}

export default BatchAggregationsExport;
