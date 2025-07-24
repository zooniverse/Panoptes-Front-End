import React, { useEffect, useState } from 'react';
import WorkflowsList from './components/workflows-list.jsx';
import AggregationsChecker from './components/aggregations-checker.jsx';
import ExpandableContainer from './components/expandable-container.jsx';

// TODO: find a better place to put shared items
import CloseIcon from '../../lab-pages-editor/icons/CloseIcon.jsx';

const DEFAULT_HANDLER = () => {};

function BatchAggregationsDialog ({
  closeModal = DEFAULT_HANDLER,  // This component is contained in a <dialog>, this function closes it.
  project,
  user
}) {
  const [ workflow, setWorkflow ] = useState(undefined);
  const [ workflowExportApiData, setWorkflowExportApiData ] = useState({
    workflowExport: null,
    status: 'ready',
  });

  // Checks if the workflow export has been triggered.
  async function checkWorkflowExportStatus () {
    if (!project) return;
    try {
      setWorkflowExportApiData({
        workflowExport: null,
        status: 'fetching'
      });

      // Yeah on Panoptes it's called workflowS (plural) export, but we present
      // it to the users as a worklow (singluar) export.
      const workflowExport = await project.get('workflows_export');
      setWorkflowExportApiData({
        workflowExport: workflowExport,
        status: 'success'
      });
      console.log('+++ ', workflowExport);

    } catch (err) {
      console.error('BatchAggregationsDialog', err)
      setWorkflowExportApiData({
        workflowExport: null,
        status: 'error'
      });
    }
  }

  // Trigger checkWorkflowExportStatus every time project changes.
  useEffect(checkWorkflowExportStatus, [project]);

  if (!project) return null;

  return (
    <div className="batch-aggregations-dialog">
      <div className="dialog-header">
        <h2>Batch Aggregations</h2>
        <button
          aria-label="Close dialog"
          className="button close-button"
          onClick={closeModal}
        >
          <CloseIcon />
        </button>
      </div>

      <div className="dialog-body">

        <div className="info">
          <p>Two exports are necessary to generate a batch aggregation.</p>
        </div>

        <ExpandableContainer
          header={<span><b>1</b> Classifications by Workflow</span>}
        >
          <p>Choose which workflow to include in the export here. Only workflows with Question tasks or Survey tasks are compatible with our batch aggregation export at this time.</p>
          <WorkflowsList
            project={project}
            setWorkflow={setWorkflow}
            workflow={workflow}
          />
        </ExpandableContainer>

        <ExpandableContainer
          header={<span><b>2</b> Workflow</span>}
        >
          <div>
            <i>PLACEHOLDER</i>
            <p>✅ Workflow was last exported on <b>XYZ</b></p> 
          </div>
        </ExpandableContainer>

        <ExpandableContainer
          header={<span><b>3</b> Summary</span>}
        >
          <div>
            <i>PLACEHOLDER</i>
            {workflow ? (
              <p>✅ Selected workflow is valid</p>
            ) : (
              <p>❌ No workflow selected, OR selected workflow is valid</p>
            )}
            <p>✅ Workflows export is valid </p>
          </div>

          <div>
            <button disabled={!workflow}>Generate</button>
          </div>
        </ExpandableContainer>
        
        <ExpandableContainer
          header={<i>DEBUG</i>}
        >
          <AggregationsChecker
            user={user}
            workflow={workflow}
          />
        </ExpandableContainer>
      </div>
    </div>
  );
}

export default BatchAggregationsDialog;
