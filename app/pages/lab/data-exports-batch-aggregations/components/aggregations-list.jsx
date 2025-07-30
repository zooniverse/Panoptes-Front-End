/*
Aggregations List
Displays all aggregations that belong to a project.

- Supports paging.
- Aggregations are sorted by most recently updated.
  (Dev note: see fetchAggregations() for how we request this from Panoptes) 

Component Props:
- project: the project whose aggregations we want to list. (Panoptes Project
  Resource)
 */

import React, { useEffect, useState } from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import getAPIEnv from '../helpers/getAPIEnv.js';
import AggregationItem from './aggregation-item.jsx'

const DEFAULT_API_DATA = {
  aggregations: [],
  status: 'ready',
  statusMessage: '',
};

function AggregationsList ({
  project
}) {
  const [apiData, setApiData] = useState(DEFAULT_API_DATA);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  function reset () {
    setApiData(DEFAULT_API_DATA);
    setCurrentPage(1);
    setMaxPage(1);
  }

  async function fetchAggregations (page = currentPage) {
    // Sanity check: if there's no project, reset everything and then do nothing.
    if (!project) return reset();

    try {
      // Initialise fetching state, then fetch.
      setApiData({
        aggregations: [],
        status: 'fetching',
        statusMessage: ''
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
        status: 'success',
        statusMessage: ''
      });
    
    } catch (err) {
      // On failure... it's kinda expected. A project with no aggregations returns a 404.
      setApiData({
        aggregations: [],
        status: 'no-data',
        statusMessage: ''
      });
    }
  }

  useEffect(fetchAggregations, [project]);

  // When user changes the page number, fetch a new page of workflows
  function pageInput_onChange (e) {
    let newPage = parseInt(e?.currentTarget.value, 10) || 1;
    newPage = Math.max(Math.min(newPage, maxPage), 1);
    setCurrentPage(newPage);
    fetchAggregations(newPage);
  }

  if (!project) return null;

  const env = getAPIEnv();

  return (
    <div className="aggregations-list">
      {apiData.status === 'fetching' && (
        <span
          aria-label="Fetching..."
          className="fa fa-spinner fa-spin"
        />
      )}

      {(
        apiData.status === 'no-data'
        || (apiData.status === 'success' && apiData.aggregations.length === 0)
      ) && (
        <div className="message">
          There are no aggregations for this project.
        </div>
      )}

      {(apiData.status === 'success' && apiData.aggregations.length > 0) && (
        <div className="paging">
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
      )}

      {(apiData.status === 'success' && apiData.aggregations.length > 0) && (
        <ul>
          {apiData.aggregations.map(agg => (
            <AggregationItem
              key={agg.id}
              aggregation={agg}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default AggregationsList;