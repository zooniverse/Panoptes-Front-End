import React, { useRef } from 'react';
import BatchAggregations from './batch-aggregations.jsx';

function BatchAggregationsExport () {
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

  return (
    <div className="batch-aggregations-container">
      <button onClick={toggleDialog}>
        Batch Aggregations
      </button>
      <dialog ref={batchAggregationsDialog}>
        <BatchAggregations
          closeModal={closeModal}
        />
      </dialog>
    </div>
  );
}

export default BatchAggregationsExport;
