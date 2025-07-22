import React, { useEffect, useState } from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import getAPIEnv from './helpers/getAPIEnv.js';
import AggregationsList from './components/aggregations-list.jsx';
import ExpandableContainer from './components/expandable-container.jsx'

function BatchAggregationsResults ({
  project
}) {
  return (
    <div className="batch-aggregations-results">
      <ExpandableContainer
        header="RESULTS"
      >
        <AggregationsList
          project={project}
        />
      </ExpandableContainer>
    </div>
  );
}

export default BatchAggregationsResults;