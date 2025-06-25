import React, { useEffect, useState } from 'react';

const DEFAULT_HANDLER = () => {};

export default function WorkflowsList ({
  project,
  setWorkflow = DEFAULT_HANDLER,
  workflow,
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
  useEffect(fetchWorkflows, [project]);

  // When a user clicks on the 
  function workflowRadio_onChange (e) {
    const workflow = (e?.currentTarget?.checked)
      ? apiData?.workflows?.find(wf => wf.id === e?.currentTarget?.value)
      : null;
    setWorkflow(workflow);
  }
  
  if (!project) return null;

  return (
    <div>
      List of workflows - {apiData.status}
      <ul>
        {apiData.workflows?.map((wf) => (
          <li key={wf.id}>
            <input
              checked={workflow?.id === wf.id}
              id={`workflows-list-${wf.id}`}
              name="available-workflows"
              onChange={workflowRadio_onChange}
              type="radio"
              value={wf.id}
            />
            <label htmlFor={`workflows-list-${wf.id}`}>
              {wf.id} - {wf.display_name}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}