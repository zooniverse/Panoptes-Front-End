import React, { useState } from 'react';
import WorkflowsList from './components/workflows-list.jsx';
import AggregationsChecker from './components/aggregations-checker.jsx';

const DEFAULT_HANDLER = () => {};

function BatchAggregations ({
  closeModal = DEFAULT_HANDLER,  // This component is contained in a <dialog>, this function closes it.
  project,
  user
}) {
  const [ workflow, setWorkflow ] = useState(undefined);

  if (!project) return null;

  return (
    <div className="batch-aggregations">
      <h4>Batch Aggregations</h4>

      <WorkflowsList
        project={project}
        setWorkflow={setWorkflow}
        workflow={workflow}
      />

      <hr/>

      <p>
        Currently chosen workflow: {workflow ? `${workflow.id} - ${workflow.display_name}` : 'none'}
      </p>

      <hr/>

      <AggregationsChecker
        user={user}
        workflow={workflow}
      />

      <hr/>

      <div>
        <button onClick={closeModal}>Close</button>
      </div>
    </div>
  );
}

export default BatchAggregations;
