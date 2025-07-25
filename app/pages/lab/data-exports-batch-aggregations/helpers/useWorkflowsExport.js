/*
Hook: use Workflows Export
Fetches (and updates the status of) the Worklows Export of a given project.

Arguments:
- project: the project whose Workflows Export we want to check. (Panoptes
  Project Resource)

Returns:
- An object in the shape of: { data, status }
  - data is either null, or the Panoptes resource corresponding to the
    project's Workflows Export.
  - status is a string with a value of either "ready" (initial state),
    "fetching", "success", or "no-data".
 */

import React, { useEffect, useState } from 'react';

export default function useWorkflowsExport (project) {
  const [ apiData, setApiData ] = useState({
    data: null,
    status: 'ready',
  });

  function reset () {
    setApiData({
      data: null,
      status: 'ready'
    });
  }

  // Checks if the workflow export has been triggered.
  async function checkWorkflowsExport () {
    // If there's no project, reset.
    if (!project) return reset();

    try {
      // Set fetching state.
      setApiData({
        data: null,
        status: 'fetching'
      });

      // Fetch the data from Panoptes.
      const workflowsExport = await project.get('workflows_export');

      // Success! Save the data.
      setApiData({
        data: workflowsExport?.[0],
        status: 'success'
      });

    } catch (err) {
      // On failure... it's kinda expected. A project with no Workflows Export returns a 404.
      setApiData({
        data: null,
        status: 'no-data'
      });
    }
  }

  // Trigger checkWorkflowsExport every time project changes.
  useEffect(checkWorkflowsExport, [project]); 

  return apiData;
}