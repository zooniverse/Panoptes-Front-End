/*
Aggregations Checker
Given a workflow, this component checks if that workflow has any aggregations
from the Panoptes /aggregations endpoint.

NOTE: a workflow can only have ONE aggregation associated with it, or none at
all.

- Displays information on any existing aggregation.
- Allows a new aggregation to be requested, if the workflow doesn't have one 
  (either pending, completed, or error-ed out).
- Allows an existing aggregation to be deleted.

Component Props:
- user: currently logged-in user. (Panoptes User Resource)
- workflow: currently selected workflow. (Panoptes Workflow Resource)

Currently used as a debug tool.
 */

import React, { useEffect, useState } from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import getAPIEnv from '../helpers/getAPIEnv.js';

function getAggStatusSymbol (aggStatus) {
  switch (aggStatus) {
    case 'pending': return '🟡';
    case 'completed': return '🟢';
    default: return '⚪️';
  }
}

export default function AggregationsChecker ({
  user = null,
  workflow = null
}) {
  const [apiData, setApiData] = useState({
    aggregations: null,  // Despite the plural, this is either null or a single object.
    status: 'ready',
    statusMessage: '',
  });

  function reset () {
    setApiData({
      aggregations: null,
      status: 'ready',
      statusMessage: ''
    });
  }

  function onError (err) {
    console.error('AggregationsChecker', err);
    setApiData({
      aggregations: null,
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
        aggregations: null,
        status: 'fetching'
      });
      const aggregationsResourcesArray = await apiClient.type('aggregations').get({ workflow_id: workflow.id  });
      const aggregations = aggregationsResourcesArray?.[0];
      
      // On success, save the results.
      setApiData({
        aggregations: aggregations,
        status: 'success'
      });
    
    } catch (err) {
      onError(err);
    }
  }

  async function requestNewAggregations () {
    // Sanity check: if there's no workflow (or user), reset everything and then do nothing.
    if (!user || !workflow) return reset();

    try {
      // Initialise requesting state, then post.
      setApiData({
        aggregations: null,
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
      const aggregations = aggregationsResourcesArray?.[0];
      
      setApiData({
        aggregations: aggregations,
        status: 'success'
      });
    
    } catch (err) {
      onError(err);
    }
  }

  async function deleteAggregations () {
    // Sanity check: if there's no workflow or aggregation, reset everything and then do nothing.
    if (!workflow || !apiData.aggregations) return reset();

    try {
      const aggregations = apiData.aggregations;

      // Initialise deleting state, then delete.
      setApiData({
        aggregations: null,
        status: 'deleting'
      });
      await aggregations.delete();
      
      setApiData({
        aggregations: null,
        status: 'success'
      });
    
    } catch (err) {
      onError(err);
    }
  }

  useEffect(fetchAggregations, [workflow]);

  if (!user || !workflow) return null;

  const env = getAPIEnv();

  // Aggregations data, if any.
  const updatedTime = new Date(apiData.aggregations?.updated_at);
  const linkForZip = `https://aggregationdata.blob.core.windows.net/${env}/${apiData.aggregations?.uuid}/${workflow.id}_aggregation.zip`;
  const linkForCsv = `https://aggregationdata.blob.core.windows.net/${env}/${apiData.aggregations?.uuid}/${workflow.id}_reductions.csv`;

  return (
    <div>
      Do we have any existing aggregations? &nbsp;
      {['ready', 'success'].includes(apiData.status) && (
        <button onClick={fetchAggregations}>🔄 Refresh</button>
      )}
      {!['ready', 'success'].includes(apiData.status) && apiData.status}

      {apiData.statusMessage && (
        <span style={{ color: 'red' }}>&nbsp; {apiData.statusMessage?.toString()}</span>
      )}

      <br/>
      <br/>

      {apiData.status === 'success' && apiData.aggregations && (
        <div>
          Aggregation #{apiData.aggregations.id} - {getAggStatusSymbol(apiData.aggregations.status)} {apiData.aggregations.status} - {updatedTime.toLocaleTimeString()}
          <br/>
          {apiData.aggregations.status === 'completed' && (
            <span>
              <a href={linkForZip}>[Download ZIP]</a>
              &nbsp;
              <a href={linkForCsv}>[Download CSV]</a>
              <br/>
            </span>
          )}

          <br/>
          <button onClick={deleteAggregations}>❌ Delete existing aggregations</button>
          <br/>
          <i>you need to do this if you want to request a new one.</i>
        </div>
      )}

      {apiData.status === 'success' && !apiData.aggregations && (
        <div>
          No aggregations found.
          <br/>
          <br/>
          <button onClick={requestNewAggregations}>➕ Request new Aggregations</button>
        </div>
      )}
    </div>
  );
}