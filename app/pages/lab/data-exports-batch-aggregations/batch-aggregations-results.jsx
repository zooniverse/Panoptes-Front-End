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
        <p>
          <span className="fa fa-info-circle" /> If you'd like to request a new export for any of these workflows, delete the previous batch aggregation.
        </p>
        <AggregationsList
          project={project}
        />
      </ExpandableContainer>
    </div>
  );
}

export default BatchAggregationsResults;