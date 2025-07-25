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
 */

import React, { useState } from 'react';

function AggregationSummary ({
  workflow,
  workflowsExport
}) {

  return (
    <div className="aggregation-summary">
      <p>Aggregation Summary</p>
      <button>Generate</button>
    </div>
  );
}

export default AggregationSummary;