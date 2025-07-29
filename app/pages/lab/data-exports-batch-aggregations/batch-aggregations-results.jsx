/*
Batch Aggregations Results
The part of the Batch Aggregations Data Export feature that lists all existing
Batch Aggregation Data Exports for this project.

Component Props:
- project: the project whose workflows we want to list. (Panoptes Project
  Resource)
 */

import React from 'react';
import AggregationsList from './components/aggregations-list.jsx';
import ExpandableContainer from './components/expandable-container.jsx'

function BatchAggregationsResults ({
  project
}) {
  return (
    <div className="batch-aggregations-results">
      <ExpandableContainer
        header="View previous exports"
      >
        <AggregationsList
          project={project}
        />
      </ExpandableContainer>
    </div>
  );
}

export default BatchAggregationsResults;