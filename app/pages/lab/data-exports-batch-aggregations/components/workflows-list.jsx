import React, { useEffect, useState } from 'react';

const DEFAULT_HANDLER = () => {};

export default function WorkflowsList ({
  currentWorkflow,
  project,
  setCurrentWorkflow = DEFAULT_HANDLER,
}) {
  const [apiData, setApiData] = useState({
    workflows: [],
    status: 'ready'
  });

  async function fetchWorkflows () {
    // Sanity check: if there's no project, reset everything and then do nothing.
    if (!project) {
      setApiData({
        workflows: [],
        status: 'ready'
      });
      return;
    }

    try {
      const page = 1;  // TODO: paging

      // Initialise fetching state, then fetch.
      setApiData({
        workflows: [],
        status: 'fetching'
      });
      const workflowResourcesArray = await project.get('workflows', { page });
      
      // On success, save the results.
      setApiData({
        workflows: workflowResourcesArray,
        status: 'ready'
      });
    
    } catch (err) {
      // On failure, set error state.
      console.error('WorkflowsList: ', err);
      setApiData({
        workflow: [],
        status: 'error'
      });
    }
  }

  // Trigger fetchWorkflow every time project changes.
  useEffect(fetchWorkflows, [project])
  
  if (!project) return null;

  console.log('+++ apiData.workflows ', apiData.workflows);

  return (
    <div>
      List of workflows - {apiData.status}
      <ul>
        {apiData.workflows?.map((workflow) => (
          <li key={workflow.id}>
            {workflow.id} - {workflow.display_name}
          </li>
        ))}
      </ul>
    </div>
  );
}