/*
Workflows List
Displays all workflows that belong to a project, and allows users to select
which workflow they want to interact with.

- Supports paging.

Component Props:
- project: the project whose workflows we want to list. (Panoptes Project
  Resource)
- setWorkflow: sets currently selected workflow.
- workflow: currently selected workflow. (Panoptes Workflow Resource)
 */

import React, { useEffect, useState } from 'react';
import WorkflowItem from './workflow-item.jsx';

const DEFAULT_HANDLER = () => {};
const DEFAULT_API_DATA = {
  workflows: [],
  status: 'ready'
};

export default function WorkflowsList ({
  project,
  setWorkflow = DEFAULT_HANDLER,
  workflow,
}) {
  const [apiData, setApiData] = useState(DEFAULT_API_DATA);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  function reset () {
    setApiData(DEFAULT_API_DATA);
  }

  function onError (err) {
    console.error('WorkflowsList: ', err);
    setApiData({
      workflows: [],
      status: 'error'
    });
  }

  async function fetchWorkflows () {
    // Sanity check: if there's no project, reset everything and then do nothing.
    if (!project) return reset();

    try {
      // Initialise fetching state, then fetch.
      setApiData({
        workflows: [],
        status: 'fetching'
      });
      const workflowResourcesArray = await project.get('workflows', {
        page,
        // page_size: 3  // TESTING ONLY
      });

      // How many pages of results do we have?
      const resultsMeta = workflowResourcesArray?.[0]?.getMeta()
      if (resultsMeta) {
        setMaxPage(resultsMeta.page_count)
      } else {
        setMaxPage(1);
      }

      // On success, save the results.
      setApiData({
        workflows: workflowResourcesArray,
        status: 'success'
      });
    
    } catch (err) {
      // On failure, set error state.
      onError(err);
    }
  }

  // Trigger fetchWorkflow every time project (or page) changes.
  useEffect(fetchWorkflows, [page, project]);

  // When a user clicks on a workflow, select that workflow.
  function workflowItem_onChange (e) {
    const workflow = (e?.currentTarget?.checked)
      ? apiData?.workflows?.find(wf => wf.id === e?.currentTarget?.value)
      : null;
    setWorkflow(workflow);
  }

  // When user changes the page number, fetch a new page of workflows
  function pageInput_onChange (e) {
    let newPage = parseInt(e?.currentTarget.value, 10) || 1;
    newPage = Math.max(Math.min(newPage, maxPage), 1);
    setPage(newPage);
    // fetchWorkflows() will be triggered when current page changes, due to useEffect.
  }
  
  if (!project) return null;

  return (
    <div className="workflows-list">
      {apiData.status === 'fetching' && (
        <span
          aria-label="Fetching..."
          className="fa fa-spinner fa-spin"
        />
      )}

      {(
        apiData.status === 'no-data'  // NOTE: no-data can never actually occur for fetching workflows.
        || (apiData.status === 'success' && apiData.workflows.length === 0)
      ) && (
        <div className="message">
          There are no workflows for this project.
        </div>
      )}

      {(apiData.status === 'success' && apiData.workflows.length > 0) && (
        <div className="paging">
          Page
          &nbsp;
          <input
            max={maxPage}
            min="1"
            onChange={pageInput_onChange}
            type="number"
            value={page}
          />
          &nbsp;
          of {maxPage}
        </div>
      )}

      {(apiData.status === 'success' && apiData.workflows.length > 0) && (
        <table>
          <thead>
            <tr>
              <th scope="col">Workflow</th>
              <th scope="col">ID</th>
              <th scope="col">Last Requested</th>
            </tr>
          </thead>
          <tbody>
            {apiData.workflows?.map((wf) => (
              <WorkflowItem
                key={wf.id}
                checked={wf.id === workflow?.id}
                onChange={workflowItem_onChange}
                workflow={wf}
              />
            ))}
          </tbody>
        </table>
      )}

    </div>
  );
}