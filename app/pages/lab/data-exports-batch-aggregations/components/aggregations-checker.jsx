import React, { useEffect, useState } from 'react';
import getEnv from '../helpers/getEnv.js';

export default function AggregationsChecker ({
  selectedWorkflow = null
}) {
  const [apiData, setApiData] = useState({
    xyz: null,
    status: 'ready'
  });

  async function fetchAggregations () {
    // Sanity check: if there's no workflow, reset everything and then do nothing.
    if (!selectedWorkflow) {
      setApiData({
        xyz: null,
        status: 'ready'
      });
      return;
    }

    try {
      // Initialise fetching state, then fetch.
      setApiData({
        xyz: null,
        status: 'fetching'
      });

      const res = await fetch(`https://panoptes-staging.zooniverse.org/api/aggregations?workflow_id=28510`);
      // const workflowResourcesArray = await project.get('workflows', { page });
      
      // On success, save the results.
      setApiData({
        xyz: null,
        status: 'ready'
      });
    
    } catch (err) {
      // On failure, set error state.
      console.error('AggregationsChecker: ', err);
      setApiData({
        xyz: null,
        status: 'error'
      });
    }
  }

  useEffect(fetchAggregations, [selectedWorkflow])

  if (!selectedWorkflow) return null;

  return (
    <div>
      Do we have any existing aggregations? Status - {apiData.status} <br/>
      env - {getEnv()}
    </div>
  );
}