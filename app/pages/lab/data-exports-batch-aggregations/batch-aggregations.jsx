import React, { useState } from 'react';
import WorkflowsList from './components/workflows-list.jsx';

const DEFAULT_HANDLER = () => {};

function BatchAggregations ({
  closeModal = DEFAULT_HANDLER,  // This component is contained in a <dialog>, this function closes it.
  project,
}) {
  const [ selectedWorkflow, setSelectedWorkflow ] = useState(undefined);

  if (!project) return null;

  return (
    <div className="batch-aggregations">
      <h4>Batch Aggregations</h4>

      <WorkflowsList
        project={project}
        selectedWorkflow={selectedWorkflow}
        setSelectedWorkflow={setSelectedWorkflow}
      />

      <p>
        Currently chosen workflow: {selectedWorkflow ? `${selectedWorkflow.id} - ${selectedWorkflow.display_name}` : 'none'}
      </p>

      <div>
        <button onClick={closeModal}>Close</button>
      </div>
    </div>
  );
}

export default BatchAggregations;
