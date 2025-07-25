/*
Aggregation Summary
Once a (valid) Workflow is selected, and the project's Workflows Export validity
is confirmed, this component allows users to request a new Batch Aggregation
data export for that workflow.

If the Workflow already has a Batch Aggregation data export, that data export is
displayed instead of the "generate Batch Aggregation" button.

Possible states:
- Invalid: due to any of the following-
  - workflow not selected.
  - workflow selected, but contains invalid tasks.
    (Note: the Batch Aggregations feature only works with a certain subset of
    Task types.)
  - workflows export doesn't exist.
- Fetching...: workflow selected and workflows export exists, now we're checking
  if the selected workflow has any aggregations.
- Data OK, no existing aggregation:
  - workflow selected and workflows export exists. Batch aggregation data export
    doesn't exist. 
  - "generate Batch Aggregation" button available.
- Data OK, aggregation exists:
  - workflow selected and workflows export exists. Batch aggregation data export
    DOES exist.
  - "generate Batch Aggregation" button NOT available.
- Requesting...: we're attempting to request a new batch aggregation data export
  from the Panoptes API.
- Error: blargh!

Component Props:
- workflow: the selected workflow. (Panoptes Workflow Resource)
- workflowsExport: the Workflows Export data. (Panoptes Data Export Resource)
- user: currently logged-in user. (Panoptes User Resource)
 */

import React, { useEffect, useState } from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import AggregationItem from './aggregation-item.jsx';

function AggregationSummary ({
  workflow,
  workflowsExport,
  user
}) {
  const [apiData, setApiData] = useState({
    aggregation: null,
    status: 'ready',
    statusMessage: '',
  });

  function reset () {
    setApiData({
      aggregation: null,
      status: 'ready',
      statusMessage: ''
    });
  }

  function onError (err) {
    console.error('AggregationSummary', err);
    setApiData({
      aggregation: null,
      status: 'error',
      statusMessage: err
    });
  }

  async function fetchAggregations () {
    // Sanity check: if there's no workflow, reset everything and then do nothing.
    if (!workflow) return reset();

    try {
      // Initialise fetching state, then fetch.
      setApiData({
        aggregation: null,
        status: 'fetching'
      });
      const aggregationsResourcesArray = await apiClient.type('aggregations').get({ workflow_id: workflow.id  });
      const aggregation = aggregationsResourcesArray?.[0];
      
      // On success, save the results.
      setApiData({
        aggregation: aggregation,
        status: 'success'
      });
    
    } catch (err) {
      onError(err);
    }
  }

  useEffect(fetchAggregations, [workflow]);

  async function requestNewAggregation () {
    // Sanity check: if there's no workflow (or user), reset everything and then do nothing.
    if (!user || !workflow) return reset();

    try {
      // Initialise requesting state, then post.
      setApiData({
        aggregation: null,
        status: 'requesting'
      });
      const url = '/aggregations';
      const payload = {
        'aggregations': {
          'links': {
            'user': `${user.id}`,
            'workflow': `${workflow.id}`
          }
        }
      };
      const aggregationsResourcesArray = await apiClient.post(url, payload);
      const aggregation = aggregationsResourcesArray?.[0];
      
      setApiData({
        aggregation: aggregation,
        status: 'success'
      });
    
    } catch (err) {
      onError(err);
    }
  }

  const isWorkflowValid = true;

  const showExistingAggregation = apiData.status === 'success' && apiData.aggregation;

  const requestEnabled = (  // For the "request new batch aggregation data export" button to be enabled...
    workflow && isWorkflowValid  // ...a valid workflow must be selected.
    && workflowsExport  // ...the project must have a workflows export.
    && (apiData.status === 'success' && !apiData.aggregation)  // ...the selected workflow must have no existing aggregation.
  );

  const workflowsExportUpdatedAt = workflowsExport ? new Date(workflowsExport.updated_at) : null;

  return (
    <div className="aggregation-summary">
      <p>Aggregation Summary</p>
      {!workflow && (
        <p>❌ No workflow selected</p>
      )}
      {workflow && !isWorkflowValid && (
        <p>❌ Workflow {workflow.id} is invalid</p>
      )}
      {workflow && isWorkflowValid && (
        <p>✅ Workflow {workflow.id} is valid</p>
      )}

      {workflowsExport && (
        <p>✅ Workflow export date: {workflowsExportUpdatedAt?.toLocaleString()}</p>
      )}
      {!workflowsExport && (
        <p>❌ No workflow export has been generated.</p>
      )}

      {!showExistingAggregation && (
        <button
          disabled={!requestEnabled}
          onClick={requestNewAggregation}
        >
          Generate
        </button>
      )}

      {showExistingAggregation && (
        <>
          <p>Aggregation already exists</p>
          <ul className="single-aggregation">
            <AggregationItem
              aggregation={apiData.aggregation}
            />
          </ul>
        </>
      )}
    </div>
  );
}

export default AggregationSummary;