/*
Data Manager
Responsible for fetching, updating, and saving Workflow resources from/to
the Panoptes service.
 */

// ESLint: don't import global React, and don't use .defaultProps.
/* eslint-disable no-console */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/require-default-props */

import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import apiClient from 'panoptes-client/lib/api-client';
import { WorkflowContext } from './context.js';

function DataManager({
  // key: to ensure DataManager renders FRESH (with states reset) whenever workflowId changes, use <DataManager key={workflowId} ... />
  children = null,
  workflowId = ''
}) {
  const [apiData, setApiData] = useState({
    workflow: null,
    status: 'ready'
  });

  // Fetch workflow when the component loads for the first time.
  // See notes about 'key' prop, to ensure states are reset:
  // https://react.dev/learn/you-might-not-need-an-effect#resetting-all-state-when-a-prop-changes
  // Also see general pattern notes:
  // https://react.dev/reference/react/useEffect#fetching-data-with-effects
  useEffect(() => {
    async function fetchWorkflow() {
      console.log('+++ fetchWorkflow');
      try {
        setApiData({
          workflow: null,
          status: 'fetching'
        });

        const wf = await apiClient.type('workflows').get(workflowId);
        if (!wf) throw new Error('No workflow');

        setApiData({
          workflow: wf,
          status: 'ready'
        });
      } catch (err) {
        console.error('DataManager: ', err);
        setApiData({
          workflow: null,
          status: 'error'
        });
      }
    }

    fetchWorkflow();
  }, [workflowId]);

  // Wrap contextData in a memo so it doesn't re-create a new object on every render.
  // See https://react.dev/reference/react/useContext#optimizing-re-renders-when-passing-objects-and-functions
  const contextData = useMemo(() => {
    console.log('+++ DataManager.useMemo');

    /*
    Updates the workflow with new data.
    */
    async function update(data) {
      console.log('+++ DataManager.update()');

      setApiData({
        workflow: apiData.workflow,
        status: 'updating'
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Note to self: hang on, will setting setApiData() cause the useMemo to update perpetually?
      setApiData({
        workflow: apiData.workflow,
        status: 'ready'
      });
    }

    return {
      workflow: apiData.workflow,
      update
    };
  }, [apiData.workflow]); // Note to self: change this to workflowId?

  if (!workflowId) return (<div>ERROR: no Workflow ID specified</div>);
  // if (!workflow) return null

  return (
    <WorkflowContext.Provider
      value={contextData}
    >
      <div>{apiData.status}</div>
      {children}
    </WorkflowContext.Provider>
  );
}

DataManager.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  workflowId: PropTypes.string
};

export default DataManager;
