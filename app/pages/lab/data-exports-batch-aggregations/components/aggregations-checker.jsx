import React, { useEffect, useState } from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import getEnv from '../helpers/getEnv.js';

export default function AggregationsChecker ({
  workflow = null
}) {
  const [apiData, setApiData] = useState({
    aggregations: null,
    status: 'ready'
  });

  function reset () {
    setApiData({
      aggregations: [],
      status: 'ready'
    });
  }

  async function fetchAggregations () {
    // Sanity check: if there's no workflow, reset everything and then do nothing.
    if (!workflow) return reset();

    try {
      // Initialise fetching state, then fetch.
      setApiData({
        aggregations: [],
        status: 'fetching'
      });
      const aggregationsResourcesArray = await apiClient.type('aggregations').get({ workflow_id: workflow.id  });

      console.log('+++ aggregations: ', aggregationsResourcesArray);
      
      // On success, save the results.
      setApiData({
        aggregations: aggregationsResourcesArray,
        status: 'success'
      });
    
    } catch (err) {
      // On failure, set error state.
      console.error('AggregationsChecker: ', err);
      setApiData({
        aggregations: [],
        status: 'error'
      });
    }
  }

  useEffect(fetchAggregations, [workflow])

  if (!workflow) return null;

  const env = getEnv();

  return (
    <div>
      Do we have any existing aggregations? &nbsp;
      {['ready', 'success'].includes(apiData.status) && (
        <button onClick={fetchAggregations}>Refresh</button>
      )}
      {!['ready', 'success'].includes(apiData.status) && apiData.status}

      <ul>
        {apiData.aggregations?.map(agg => {
          const updatedTime = new Date(agg.updated_at);
          const linkForZip = `https://aggregationdata.blob.core.windows.net/${env}/${agg.uuid}/${workflow.id}_aggregation.zip`;
          const linkForCsv = `https://aggregationdata.blob.core.windows.net/${env}/${agg.uuid}/${workflow.id}_reductions.csv`
          return (
            <li key={agg.id}>
              Aggregation #{agg.id} - {agg.status} - {updatedTime.toUTCString()} <br/>
              {agg.status === 'completed' && (
                <span>
                  <a href={linkForZip}>[Download ZIP]</a>
                  <a href={linkForCsv}>[Download CSV]</a>
                </span>
              )}
            </li>
          )
        })}
        {apiData.status === 'success' && !(apiData.aggregations?.length > 0) && (
          <li>No aggregations found</li>
        )}
      </ul>
    </div>
  );
}