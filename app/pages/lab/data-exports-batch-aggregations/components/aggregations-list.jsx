/*
Aggregations List
Displays all aggregations that belong to a project.

- Supports paging.
- ❓ Aggregations list may or may not be sorted, we're still trying to figure out
  if the API supports this.

Component Props:
- project: the project whose aggregations we want to list. (Panoptes Project Resource)
 */

import React, { useEffect, useState } from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import getAPIEnv from '../helpers/getAPIEnv.js';
import AggregationItem from './aggregation-item.jsx'

function getAggStatusSymbol (aggStatus) {
  switch (aggStatus) {
    case 'pending': return '🟡';
    case 'completed': return '🟢';
    default: return '⚪️';
  }
}

function AggregationsList ({
  project
}) {
  const [apiData, setApiData] = useState({
    aggregations: [],
    status: 'ready',
    statusMessage: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  function reset () {
    setApiData({
      aggregations: [],
      status: 'ready',
      statusMessage: ''
    });
    setCurrentPage(1);
    setMaxPage(1);
  }

  function onError (err) {
    console.error(err);
    setApiData({
      aggregations: [],
      status: 'error',
      statusMessage: err
    });
  }

  async function fetchAggregations (page = currentPage) {
    // Sanity check: if there's no project, reset everything and then do nothing.
    if (!project) return reset();

    try {
      // Initialise fetching state, then fetch.
      setApiData({
        aggregations: [],
        status: 'fetching'
      });
      const aggregations = await apiClient.type('aggregations').get({
        project_id: project.id,
        sort: '-updated_at',
        page,
        // page_size: 3  // TESTING ONLY
      });

      // How many pages of results do we have?
      const aggMeta = aggregations?.[0].getMeta()
      if (aggMeta) {
        setMaxPage(aggMeta.page_count)
      } else {
        setMaxPage(1);
      }
      
      // On success, save the results.
      setApiData({
        aggregations: aggregations,
        status: 'success'
      });
    
    } catch (err) {
      onError(err);
    }
  }

  useEffect(fetchAggregations, [project]);

  // When user changes the page number, fetch a new page of workflows
  function pageInput_onChange (e) {
    let newPage = parseInt(e?.currentTarget.value) || 1;
    newPage = Math.max(Math.min(newPage, maxPage), 1);
    setCurrentPage(newPage);
    fetchAggregations(newPage);
  }

  if (!project) return null;

  const env = getAPIEnv();

  return (
    <div className="aggregations-list">
      List of Aggregations: {apiData.status}

      <div>
        Page
        &nbsp;
        <input
          max={maxPage}
          min="1"
          onChange={pageInput_onChange}
          type="number"
          value={currentPage}
        />
        &nbsp;
        of {maxPage}
      </div>

      {apiData.status === 'success' && apiData.aggregations.length === 0 && (
        <div className="message">
          There are no aggregations for this project.
        </div>
      )}

      <ul>
        {apiData.aggregations.map(agg => (
          <AggregationItem
            key={agg.id}
            aggregation={agg}
          />
        ))}
      </ul>
    </div>
  );
}

export default AggregationsList;