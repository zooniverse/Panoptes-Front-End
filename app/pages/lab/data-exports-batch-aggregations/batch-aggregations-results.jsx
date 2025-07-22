import React, { useEffect, useState } from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import getAPIEnv from './helpers/getAPIEnv.js';

function getAggStatusSymbol (aggStatus) {
  switch (aggStatus) {
    case 'pending': return '🟡';
    case 'completed': return '🟢';
    default: return '⚪️';
  }
}

function BatchAggregationsResults ({
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
        sort: '-workflow_id'
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
    <div className="batch-aggregations-results">
      <span>Results: {apiData.status}</span>

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
        <div>
          There are no aggregations for this project.
        </div>
      )}

      {apiData.aggregations.map(agg => {
        const updatedTime = new Date(agg.updated_at);
        const linkForZip = `https://aggregationdata.blob.core.windows.net/${env}/${agg.uuid}/${agg.links?.workflow}_aggregation.zip`;
        const linkForCsv = `https://aggregationdata.blob.core.windows.net/${env}/${agg.uuid}/${agg.links?.workflow}_reductions.csv`;

        return (
          <div
            key={agg.id}
            className="batch-aggregations-result"
          >
            Workflow {agg.links?.workflow} - Aggregation #{agg.id}
            <br/>
            {getAggStatusSymbol(agg.status)} {agg.status} - {updatedTime.toLocaleTimeString()}
            <br/>
            {agg.status === 'completed' && (
              <span>
                <a href={linkForZip}>[Download ZIP]</a>
                &nbsp;
                <a href={linkForCsv}>[Download CSV]</a>
                <br/>
              </span>
            )}

            <br/>
            <button onClick={() => { alert('TODO') }}>❌ Delete existing aggregations</button>
            <br/>
            <i>you need to do this if you want to request a new one.</i>
          </div>
        );
      })}
    </div>
  );
}

export default BatchAggregationsResults;