import React, { useEffect, useState } from 'react';

const DEFAULT_FUNCTION = () => {};

export default function WorkflowItem ({
  checked = false,
  onChange = DEFAULT_FUNCTION,
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

    /*
    workflow.get('classifications_export')
    .then((media) => {
      const mediaState = this.state.media;
      mediaState[workflow.id] = media[0];
      this.setState({ media: mediaState });
    })
    .catch((error) => {
      if (error.status !== 404) {
        const workflowErrorState = this.state.workflowError;
        workflowErrorState[workflow.id] = error[0];
        this.setState({ workflowError: workflowErrorState });
      }
    });
    */
  }

  useEffect(fetchWorkflowClassificationExportStatus, [workflow]);

  if (!workflow) return null;

  const updatedTime = new Date(apiData.wfcExport?.updated_at);
  const selectionDisabled = (apiData.status !== 'success');

  return (
    <li
      style={{ color: (selectionDisabled) ? '#a0a0a0' : undefined }}
    >
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
        {workflow.id} - {workflow.display_name}
      </label>

      {(apiData.status === 'success') && (
        <span>
          &nbsp; ✔️ Exported {updatedTime.toLocaleTimeString()}
        </span>
      )}

      {(apiData.status === 'no-data') && (
        <span>
          &nbsp; ❌ No data export
        </span>
      )}

    </li>
  );
}