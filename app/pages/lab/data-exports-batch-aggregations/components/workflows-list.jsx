import React, { useEffect, useState } from 'react';
import WorkflowItem from './workflow-item.jsx';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  async function fetchWorkflows (page = currentPage) {
    // Sanity check: if there's no project, reset everything and then do nothing.
    if (!project) {
      setApiData({
        workflows: [],
        status: 'ready'
      });
      return;
    }

    try {
      // Initialise fetching state, then fetch.
      setApiData({
        workflows: [],
        status: 'fetching'
      });
      const workflowResourcesArray = await project.get('workflows', { page });

      // How many pages of results do we have?
      const resultsMeta = workflowResourcesArray?.[0].getMeta()
      if (resultsMeta) {
        setMaxPage(resultsMeta.page_count)
      } else {
        setMaxPage(1);
      }

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

  // When a user clicks on a workflow, select that workflow.
  function workflowItem_onChange (e) {
    const workflow = (e?.currentTarget?.checked)
      ? apiData?.workflows?.find(wf => wf.id === e?.currentTarget?.value)
      : null;
    setWorkflow(workflow);
  }

  // When user changes the page number, fetch a new page of workflows
  function pageInput_onChange (e) {
    let newPage = parseInt(e?.currentTarget.value) || 1;
    newPage = Math.max(Math.min(newPage, maxPage), 1);
    setCurrentPage(newPage);
    fetchWorkflows(newPage);
  }
  
  if (!project) return null;

  return (
    <div>
      List of workflows - {apiData.status}

      <div>
        Page
        &nbsp;
        <input
          max={maxPage}
          min="1"
          onChange={pageInput_onChange}
          type="number"
          value={currentPage}
        />
        &nbsp;
        of {maxPage}
      </div>

      <ul>
        {apiData.workflows?.map((wf) => (
          <WorkflowItem
            key={wf.id}
            checked={wf.id === workflow?.id}
            onChange={workflowItem_onChange}
            workflow={wf}
          />
        ))}
      </ul>

    </div>
  );
}