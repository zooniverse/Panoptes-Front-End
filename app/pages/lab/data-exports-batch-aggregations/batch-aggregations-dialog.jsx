/*
Batch Aggregations Dialog/Modal
The part of the Batch Aggregations Data Export feature that lets users request
new aggregations for any workflow on the project. 

Divided into 3 steps for the user:
1. select workflow (that has a valid workflow classifications export)
2. confirm that the workflows export exists.
3. request a new batch aggregation data export for the selected workflow (if one
   doesn't already exist).

Component Props:
- closeModal: callback function when the modal's Close button is clicked.
  Usually it's just the parent component calling htmlDialogElement.close()
- project: the project whose workflows we want to list. (Panoptes Project
  Resource)
- user: currently logged-in user. (Panoptes User Resource)
 */

import React, { useEffect, useState } from 'react';
import WorkflowsList from './components/workflows-list.jsx';
import AggregationsChecker from './components/aggregations-checker.jsx';
import ExpandableContainer from './components/expandable-container.jsx';
import WorkflowsExportChecker from './components/workflows-export-checker.jsx';
import AggregationSummary from './components/aggregation-summary.jsx';
import useWorkflowsExport from './helpers/useWorkflowsExport.js';

const DEFAULT_HANDLER = () => {};

function BatchAggregationsDialog ({
  closeModal = DEFAULT_HANDLER,  // This component is contained in a <dialog>, this function closes it.
  project,
  user
}) {
  const [ workflow, setWorkflow ] = useState(undefined);
  const { data: workflowsExportData, status: workflowsExportStatus } = useWorkflowsExport(project);

  if (!project) return null;

  return (
    <div className="batch-aggregations-dialog">
      <div className="header">
        <h2>Batch Aggregations</h2>
        <button
          aria-label="Close dialog"
          className="button close-button"
          onClick={closeModal}
        >
          <span style={{ fontSize: '1.5em' }} className="fa fa-times" />
        </button>
      </div>
      
      <div className="body">

        <p className="info">
          Two exports are necessary to generate a batch aggregation.
        </p>

        <ExpandableContainer
          header={<span><b>1</b> Workflow Classifications</span>}
        >
          <p>Choose which workflow to include in the export here. Only workflows with <b>Question</b> tasks or <b>Survey</b> tasks are compatible with our batch aggregation export at this time.</p>
          <WorkflowsList
            project={project}
            setWorkflow={setWorkflow}
            workflow={workflow}
          />
        </ExpandableContainer>

        <ExpandableContainer
          header={<span><b>2</b> Workflow</span>}
        >
          <WorkflowsExportChecker
            status={workflowsExportStatus}
            workflowsExport={workflowsExportData}
          />
        </ExpandableContainer>

        <ExpandableContainer
          header={<span><b>3</b> Summary</span>}
        >
          <AggregationSummary
            user={user}
            workflow={workflow}
            workflowsExport={workflowsExportData}
          />
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
