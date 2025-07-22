import React, { useEffect, useState } from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import getAPIEnv from './helpers/getAPIEnv.js';
import AggregationsList from './components/aggregations-list.jsx';


function BatchAggregationsResults ({
  project
}) {
  return (
    <div className="batch-aggregations-result">
      <AggregationsList
        project={project}
      />
    </div>
  );
}

export default BatchAggregationsResults;