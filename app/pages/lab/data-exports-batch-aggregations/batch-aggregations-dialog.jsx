import React, { useState } from 'react';
import WorkflowsList from './components/workflows-list.jsx';
import AggregationsChecker from './components/aggregations-checker.jsx';

// TODO: find a better place to put shared items
import CloseIcon from '../../lab-pages-editor/icons/CloseIcon.jsx';

const DEFAULT_HANDLER = () => {};

function BatchAggregationsDialog ({
  closeModal = DEFAULT_HANDLER,  // This component is contained in a <dialog>, this function closes it.
  project,
  user
}) {
  const [ workflow, setWorkflow ] = useState(undefined);

  if (!project) return null;

  return (
    <div className="batch-aggregations-dialog">
      <div className="batch-aggregations-header">
        <h2>Batch Aggregations</h2>
        <button
          aria-label="Close dialog"
          className="button close-button"
          onClick={closeModal}
        >
          <CloseIcon />
        </button>
      </div>

      <div className="batch-aggregations-info">
        <p>Two exports are necessary to generate a batch aggregation.</p>
      </div>

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
    </div>
  );
}

export default BatchAggregationsDialog;
