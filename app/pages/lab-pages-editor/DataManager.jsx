/*
Data Manager
Responsible for fetching, updating, and saving Workflow resources from/to
the Panoptes service.

Also fetches the project resource for secondary purposes. (e.g. figuring out
which Subject Sets are available for the workflow, available experimental tools,
and the workflow's preview URL.)
 */

// ESLint: don't import global React, and don't use .defaultProps.
/* eslint-disable no-console */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/require-default-props */

import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import apiClient from 'panoptes-client/lib/api-client';
import { WorkflowContext } from './context.js';
import checkIsPFEWorkflow from './helpers/checkIsPFEWorkflow.js';
import checkIsWorkflowPartOfProject from './helpers/checkIsWorkflowPartOfProject.js';

function DataManager({
  // key: to ensure DataManager renders FRESH (with states reset) whenever workflowId changes, use <DataManager key={workflowId} ... />
  children = null,
  projectId = '',
  workflowId = ''
}) {
  const [apiData, setApiData] = useState({
    project: null,
    workflow: null,
    status: 'ready'
  });
  const [updateCounter, setUpdateCounter] = useState(0); // Number of updates so far, only used to trigger useMemo.
  const isPFEWorkflow = checkIsPFEWorkflow(apiData.workflow);

  // Fetch workflow when the component loads for the first time.
  // See notes about 'key' prop, to ensure states are reset:
  // https://react.dev/learn/you-might-not-need-an-effect#resetting-all-state-when-a-prop-changes
  // Also see general pattern notes:
  // https://react.dev/reference/react/useEffect#fetching-data-with-effects
  useEffect(() => {
    async function fetchProjectAndWorkflow() {
      try {
        setApiData({
          project: null,
          workflow: null,
          status: 'fetching'
        });

        const [ proj, wf ] = await Promise.all([
          apiClient.type('projects').get(projectId),
          apiClient.type('workflows').get(workflowId)
        ]);
        if (!proj) throw new Error('No project');
        if (!wf) throw new Error('No workflow');

        setApiData({
          project: proj,
          workflow: wf,
          status: 'ready'
        });

      } catch (err) {
        console.error('DataManager: ', err);
        setApiData({
          project: null,
          workflow: null,
          status: 'error'
        });
      }
    }

    fetchProjectAndWorkflow();
  }, [workflowId]);

  // Listen for workflow changes, and update a counter to prompt useMemo to update the context.
  // NOTE: we're not listening for *project* changes, as the DataManager isn't meant to update that resource.
  useEffect(() => {
    const wf = apiData.workflow;
    function onWorkflowChange() {
      setUpdateCounter((uc) => uc + 1);
    }
    wf?.listen('change', onWorkflowChange);
    return () => {
      wf?.stopListening('change', onWorkflowChange);
    };
  }, [apiData.workflow]);

  // Wrap contextData in a memo so it doesn't re-create a new object on every render.
  // See https://react.dev/reference/react/useContext#optimizing-re-renders-when-passing-objects-and-functions
  const contextData = useMemo(() => {
    // Updates the workflow with new data.
    async function update(data) {
      const wf = apiData.workflow;
      if (!wf) return;

      setApiData((prevState) => ({
        ...prevState,
        status: 'updating'
      }));

      const newWorkflow = await wf.update(data).save();

      setApiData((prevState) => ({
        ...prevState,
        workflow: newWorkflow, // Note: newWorkflow is actually the same as the old wf, so useMemo will have to listen to status changing instead.
        status: 'ready'
      }));

      return newWorkflow;
    }

    return {
      project: apiData.project,
      status: apiData.status,
      workflow: apiData.workflow,
      update
    };
  }, [apiData.project, apiData.workflow, apiData.status, updateCounter]);

  // Safety check: did this component receive its minimum input?
  if (!workflowId) return (<div>ERROR: no Workflow ID specified</div>);

  // Safety check: does this workflow belong to this project?
  if (apiData.workflow && apiData.project) {
    const isWorkflowPartOfProject = checkIsWorkflowPartOfProject(apiData.workflow, apiData.project);
    if (!isWorkflowPartOfProject) {
      return (
        <div className="status-banner error">
          ERROR: workflow {apiData.workflow.id} doesn't belong to project {apiData.project.id}
        </div>
      );
    }
  }

  // NOTE: no need to check for !workflow.
  // This is automatically handled by "Error: could not fetch data"
  // // if (!workflow) return null

  return (
    <WorkflowContext.Provider
      value={contextData}
    >
      {apiData.status === 'fetching' && (
        <div className="status-banner fetching">Fetching data...</div>
      )}
      {apiData.status === 'error' && (
        <div className="status-banner error">ERROR: could not fetch data</div>
      )}
      {isPFEWorkflow ? <PFEWorkflowWarning /> : children }
    </WorkflowContext.Provider>
  );
}

/*
At the moment, we don't fully support PFE workflows in the Pages Editor.
Reason: the "autocleanup" functionality (see cleanupTasksAndSteps()) would
annihilate all the tasks in a workflow with no steps (i.e. PFE workflows).
We'd need to prompt users to convert from a PFE workflow to an FEM workflow
first before allowing them 
 */
function PFEWorkflowWarning() {
  return (
    <div className="pfe-workflow-warning">
      <p>Sorry, but the new workflow editor doesn't support traditional workflows.</p>
      <p>Please check back with us later, as we improve the workflow editor.</p>
    </div>
  );
}

DataManager.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  projectId: PropTypes.string,
  workflowId: PropTypes.string
};

export default DataManager;
