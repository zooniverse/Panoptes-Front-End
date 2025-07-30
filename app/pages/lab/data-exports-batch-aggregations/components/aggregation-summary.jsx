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
import checkIsWorkflowValid from '../helpers/checkIsWorkflowValid.js';

const DEFAULT_API_DATA = {
  aggregation: null,
  status: 'ready',
  statusMessage: '',
};

function AggregationSummary ({
  workflow,
  workflowsExport,
  user
}) {
  const [apiData, setApiData] = useState(DEFAULT_API_DATA);

  function reset () {
    setApiData(DEFAULT_API_DATA);
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
        status: 'fetching',
        statusMessage: ''
      });
      const aggregationsResourcesArray = await apiClient.type('aggregations').get({ workflow_id: workflow.id  });
      const aggregation = aggregationsResourcesArray?.[0];
      
      // On success, save the results.
      setApiData({
        aggregation: aggregation,
        status: 'fetched',
        statusMessage: ''
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
        status: 'requesting',
        statusMessage: ''
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
        status: 'requested',
        statusMessage: ''
      });
    
    } catch (err) {
      onError(err);
    }
  }

  // After an existing aggregation is deleted, wait a few seconds and then re-request.
  function onExistingAggregationDelete () {
    const DELAY = 3000;
    setTimeout(fetchAggregations, DELAY);
  }

  const isWorkflowValid = checkIsWorkflowValid(workflow);

  const showExistingAggregation = ['fetched', 'requested'].includes(apiData.status) && apiData.aggregation;

  const requestEnabled = (  // For the "request new batch aggregation data export" button to be enabled...
    workflow && isWorkflowValid  // ...a valid workflow must be selected.
    && workflowsExport  // ...the project must have a workflows export.
    && (['fetched', 'requested'].includes(apiData.status) && !apiData.aggregation)  // ...the selected workflow must have no existing aggregation.
  );

  const workflowsExportUpdatedAt = workflowsExport ? new Date(workflowsExport.updated_at) : null;

  return (
    <div className="aggregation-summary">
      {!workflow && (
        <p className="bold warning">
          <span className="fa fa-exclamation-triangle" />
          <span>No workflow selected.</span>
        </p>
      )}
      {workflow && !isWorkflowValid && (
        <p className="bold warning">
          <span className="fa fa-exclamation-triangle" />
          <span>Workflow {workflow.id} is invalid - check that the workflow only contains Question and Survey Tasks.</span>
        </p>
      )}
      {workflow && isWorkflowValid && (
        <p className="bold">
          <span className="fa fa-check-circle-o" />
          <span>Workflow {workflow.id} is valid.</span>
        </p>
      )}

      {workflowsExport && (
        <p className="bold">
          <span className="fa fa-check-circle-o" />
          <span>Workflow export date: {workflowsExportUpdatedAt?.toLocaleString()}</span>
        </p>
      )}
      {!workflowsExport && (
        <p className="bold warning">
          <span className="fa fa-exclamation-triangle" />
          <span>No workflow export has been generated.</span>
        </p>
      )}

      {apiData.status === 'error' && (
        <div className="message error">
          Unknown Error
        </div>
      )}

      {!showExistingAggregation && (
        <button
          className="button generate-button"
          disabled={!requestEnabled}
          onClick={requestNewAggregation}
        >
          {!['fetching', 'requesting'].includes(apiData.status) && (
            'Generate'
          )}
          {apiData.status === 'fetching' && (
            <>
              <span className="fa fa-spinner fa-spin" /> &nbsp; 'Checking...'
            </>
          )}
          {apiData.status === 'requesting' && (
            <>
              <span className="fa fa-spinner fa-spin" /> &nbsp; 'Generating...'
            </>
          )}
        </button>
      )}

      {showExistingAggregation && (
        <>
          {apiData.status === 'fetched' && (
            <p>Aggregation already exists.</p>
          )}
          {apiData.status === 'requested' && (
            <p>New aggregation requested.</p>
          )}
          <ul className="single-aggregation">
            <AggregationItem
              aggregation={apiData.aggregation}
              onDelete={onExistingAggregationDelete}
            />
          </ul>
        </>
      )}
    </div>
  );
}

export default AggregationSummary;