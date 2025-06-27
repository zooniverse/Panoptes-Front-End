import React, { useEffect, useState } from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import getEnv from '../helpers/getEnv.js';

export default function AggregationsChecker ({
  user = null,
  workflow = null
}) {
  const [apiData, setApiData] = useState({
    aggregations: null,  // Despite the plural, this is either null or a single object.
    status: 'ready'
  });

  function reset () {
    setApiData({
      aggregations: null,
      status: 'ready'
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
      // On failure, set error state.
      console.error('AggregationsChecker: ', err);
      setApiData({
        aggregations: null,
        status: 'error'
      });
    }
  }

  async function requestNewAggregations () {
    // Sanity check: if there's no workflow, reset everything and then do nothing.
    if (!user || !workflow) return reset();

    try {
      // Initialise fetching state, then fetch.
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
      const testResponse = await apiClient.post(url, payload);
      console.log('+++ test: ', testResponse);
      
      setApiData({
        aggregations: null,
        status: 'success'
      });
    
    } catch (err) {
      // On failure, set error state.
      console.error('AggregationsChecker: ', err);
      setApiData({
        aggregations: null,
        status: 'error'
      });
    }
  }

  useEffect(fetchAggregations, [user, workflow])

  if (!user || !workflow) return null;

  const env = getEnv();

  // Aggregations data, if any.
  const updatedTime = new Date(apiData.aggregations?.updated_at);
  const linkForZip = `https://aggregationdata.blob.core.windows.net/${env}/${apiData.aggregations?.uuid}/${workflow.id}_aggregation.zip`;
  const linkForCsv = `https://aggregationdata.blob.core.windows.net/${env}/${apiData.aggregations?.uuid}/${workflow.id}_reductions.csv`;

  return (
    <div>
      Do we have any existing aggregations? &nbsp;
      {['ready', 'success'].includes(apiData.status) && (
        <button onClick={fetchAggregations}>Refresh</button>
      )}
      {!['ready', 'success'].includes(apiData.status) && apiData.status}

      <br/>
      <br/>

      {apiData.status === 'success' && apiData.aggregations && (
        <div>
          Aggregation #{apiData.aggregations.id} - {apiData.aggregations.status} - {updatedTime.toUTCString()}
          <br/>
          {apiData.aggregations.status === 'completed' && (
            <span>
              <a href={linkForZip}>[Download ZIP]</a>
              &nbsp;
              <a href={linkForCsv}>[Download CSV]</a>
              <br/>
              <br/>
            </span>
          )}
          <button>Delete existing aggregations</button> - you need to do this if you want to request a new one.
        </div>
      )}

      {apiData.status === 'success' && !apiData.aggregations && (
        <div>
          No aggregations found.
          <br/>
          <button onClick={requestNewAggregations}>Request new Aggregations</button>
        </div>
      )}

      <br/>
    </div>
  );
}