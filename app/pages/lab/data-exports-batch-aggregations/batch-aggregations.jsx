import React, { useRef } from 'react';
import BatchAggregationsDialog from './batch-aggregations-dialog.jsx';
import BatchAggregationsResults from './batch-aggregations-results.jsx';

function BatchAggregations ({ project, user }) {
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
  // setTimeout(openModal, 100)

  return (
    <div className="batch-aggregations">
      <button onClick={toggleDialog}>
        Aggregate My Results
      </button>
      <BatchAggregationsResults
        project={project}
      />
      <dialog ref={batchAggregationsDialog}>
        <BatchAggregationsDialog
          closeModal={closeModal}
          project={project}
          user={user}
        />
      </dialog>
    </div>
  );
}

export default BatchAggregations;
