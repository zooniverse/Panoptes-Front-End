/*
Workflow Item
Displays a single item on the Workflows List. (See worklows-list.jsx)

- Displays basic workflow details, and the workflow's most recent "workflow
  classifications" export.
- Contains a radio input that lets users select this workflow.
- Radio input is DISABLED if workflow doesn't have a corresponding "workflow
  classifications" export!

Arguments:
- checked: indicates if the radio input is checked.
- onChange: callback function, for when the radio input is changed.
- workflow: the workflow to display. (Panoptes Workflow Resource)
 */

import React, { useEffect, useState } from 'react';

const DEFAULT_HANDLER = () => {};

export default function WorkflowItem ({
  checked = false,
  onChange = DEFAULT_HANDLER,
  workflow
}) {
  const [apiData, setApiData] = useState({
    wfcExport: null,
    status: 'ready'
  });

  async function fetchWorkflowClassificationExportStatus () {
    try {
      // Initialise fetching state, then fetch.
      setApiData({
        wfcExport: undefined,
        status: 'fetching'
      });
      const wfcExportData = await workflow.get('classifications_export');

      // On success, save the results.
      setApiData({
        wfcExport: wfcExportData?.[0],
        status: 'success'
      });
    
    } catch (err) {
      // On failure... it's kinda expected. A workflow with no Classifications Export returns a 404.
      setApiData({
        wfcExport: undefined,
        status: 'no-data'
      });
    }
  }

  useEffect(fetchWorkflowClassificationExportStatus, [workflow]);

  if (!workflow) return null;

  const updatedTime = new Date(apiData.wfcExport?.updated_at);
  const selectionDisabled = (apiData.status !== 'success');

  return (
    <tr
      className="workflow-item"
      style={{ color: (selectionDisabled) ? '#a0a0a0' : undefined }}
    >
      <td>
        <input
          checked={checked}
          disabled={selectionDisabled}
          id={`workflows-list-${workflow.id}`}
          name="available-workflows"
          onChange={onChange}
          type="radio"
          value={workflow.id}
        />
        <label htmlFor={`workflows-list-${workflow.id}`}>
          {workflow.display_name}
        </label>
      </td>
      <td>
        {workflow.id}
      </td>

      <td>
        {(apiData.status === 'success') && (
          <span>
            Exported {updatedTime.toLocaleString()}
          </span>
        )}
        {(apiData.status === 'no-data') && (
          <span>
            Never
          </span>
        )}
      </td>

    </tr>
  );
}