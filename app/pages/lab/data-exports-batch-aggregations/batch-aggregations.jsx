/*
Batch Aggregations (Base Component)
aka "Aggregate My Results"
The base component of the Batch Aggregations feature on the Data Exports page.
Contains two major sub-components (that actually do all the work): 1. a list of
all existing aggregations for the project, and 2. a modal for requesting new
aggregations for a selected workflow.

Component Props:
- project: the project whose workflows we want to list. (Panoptes Project
  Resource)
- user: currently logged-in user. (Panoptes User Resource)
 */

import React, { useRef } from 'react';
import BatchAggregationsDialog from './batch-aggregations-dialog.jsx';
import BatchAggregationsResults from './batch-aggregations-results.jsx';

function BatchAggregations ({
  project,
  user
}) {
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
    <section className="batch-aggregations">
      <div className="header">
        <h3>Aggregate My Results</h3>
        <p>Two exports are necessary to generate a batch aggregation. Before configuring, please ensure you have exported both a <b>Workflow Classification</b> export and a <b>Workflow</b> export.</p>
        <span className="spacer">&nbsp;</span>
        <button
          className="button"
          onClick={toggleDialog}
        >
          Configure
        </button>
      </div>
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
    </section>
  );
}

export default BatchAggregations;
