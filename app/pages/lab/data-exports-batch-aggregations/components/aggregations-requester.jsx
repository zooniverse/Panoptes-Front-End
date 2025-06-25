import React, { useEffect, useState } from 'react';
import apiClient from 'panoptes-client/lib/api-client';

export default function AggregationsRequester ({
  user,
  workflow
}) {
  const [apiData, setApiData] = useState({
    status: 'ready'
  });

  function reset () {
    setApiData({
      status: 'ready'
    });
  }

  async function requestAggregations () {
    // Sanity check: if there's no workflow, reset everything and then do nothing.
    if (!user || !workflow) return reset();

    try {
      // Initialise fetching state, then fetch.
      setApiData({
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
      const test = await apiClient.post(url, payload);

      console.log('+++ test: ', test);
      
      setApiData({
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

  useEffect(reset, [user, workflow])

  if (!user || !workflow) return null;

  return (
    <div>
      {['ready'].includes(apiData.status)
        ? <button onClick={requestAggregations}>Request new Batch Aggregations</button>
        : apiClient.status
      }
    </div>
  );
}