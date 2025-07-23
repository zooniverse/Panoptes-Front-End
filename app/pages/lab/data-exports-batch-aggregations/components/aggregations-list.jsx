/*
Aggregations List
Displays all aggregations that belong to a project.

- Supports paging.
- ❓ Aggregations list may or may not be sorted, we're still trying to figure out
  if the API supports this.

Arguments:
- project: the project whose aggregations we want to list. (Panoptes Project Resource)
 */

import React, { useEffect, useState } from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import getAPIEnv from '../helpers/getAPIEnv.js';

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
        sort: '-workflow_id',
        page,
        page_size: 3  // TESTING ONLY
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
        {apiData.aggregations.map(agg => {
          const updatedTime = new Date(agg.updated_at);
          const linkForZip = `https://aggregationdata.blob.core.windows.net/${env}/${agg.uuid}/${agg.links?.workflow}_aggregation.zip`;
          const linkForCsv = `https://aggregationdata.blob.core.windows.net/${env}/${agg.uuid}/${agg.links?.workflow}_reductions.csv`;

          return (
            <li
              key={agg.id}
              className="aggregation-item"
            >
              <div>
                Workflow {agg.links?.workflow} - Aggregation #{agg.id}
              </div>
              <div>
                {getAggStatusSymbol(agg.status)} {agg.status} - {updatedTime.toLocaleString()}
              </div>
              {agg.status === 'completed' && (
                <div>
                  <a href={linkForZip}>[Download ZIP]</a>
                  &nbsp;
                  <a href={linkForCsv}>[Download CSV]</a>
                </div>
              )}
              <div>
                <button onClick={() => { alert('TODO') }}>❌ Delete</button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default AggregationsList;