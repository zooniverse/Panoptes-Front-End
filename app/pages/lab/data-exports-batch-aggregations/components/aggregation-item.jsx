/*
Aggregation Item
Displays a single aggregation item.

- Allows this aggregation to be deleted.
- Usually used with the Aggregations List (See aggregations-list.jsx) but works
  as a standalone item too. Just remember to wrap it in a <ul>.
- An aggregation resource can be in one of the following states:
  - pending: work is still being worked upon, in a very working manner.
  - completed: processing work is all done. We can extrapolate links to the
    download resources. 
  - ❓ error: a theoretical state where something went wrong. Never actually
    seen in action as of Jul 2025. 

Component Props:
- aggregation: the aggregation to display. (Panoptes Aggregation Resource)
- onDelete: callback function, triggered when an aggregation is SUCCESSFULLY
  deleted.
 */

import React, { useState } from 'react';
import getAPIEnv from '../helpers/getAPIEnv.js';
import generateAggregationDownloadUrl from '../helpers/generateAggregationDownloadUrl.js';

const DEFAULT_HANDLER = () => {};
const DEFAULT_API_DATA = {
  status: 'ready'
};

function AggregationItem ({
  aggregation,
  onDelete = DEFAULT_HANDLER
}) {
  const [apiData, setApiData] = useState(DEFAULT_API_DATA);

  function reset () {
    setApiData(DEFAULT_API_DATA);
  }

  function onError (err) {
    console.error('AggregationItem', err);
    setApiData({
      status: 'error'
    });
  }

  async function deleteAggregation () {
    // Sanity check: if there's no aggregation, ignore.
    if (!aggregation) return reset();

    try {
      // Initialise deleting state, then delete.
      setApiData({
        status: 'deleting'
      });
      await aggregation.delete();
      
      setApiData({
        status: 'deleted'
      });

      onDelete()
    
    } catch (err) {
      onError(err);
    }
  }

  if (!aggregation) return null;

  if (['deleting', 'deleted', 'error'].includes(apiData.status)) {
    return (
      <li className="aggregation-item">
        <div className={`message ${apiData.status === 'error' ? 'error' : ''}`}>
          {apiData.status === 'deleting' && (
            <>
              <span className="fa fa-spinner fa-spin" /> &nbsp; Deleting...
            </>
          )}
          {apiData.status === 'deleted' && 'Deleted'}
          {apiData.status === 'error' && 'Error'}
        </div>
      </li>
    );
  }

  // Aggregations data, if any.
  const updatedTime = new Date(aggregation.updated_at);
  const env = getAPIEnv();
  const linkForZip = generateAggregationDownloadUrl(aggregation, env, 'zip');

  return (
    <li className="aggregation-item">
      <div className="aggregation-id">
        <h6>Aggregation #{aggregation.id}</h6>
      </div>
      <div className="aggregation-info">
        <p className="workflow-id">
          Workflow #{aggregation.links?.workflow}
        </p>
        <p className="aggregation-updated-at">
          Last updated {updatedTime.toLocaleString()}
        </p>
      </div>
      <div className="aggregation-status">
        {aggregation.status === 'pending' && (
          <>
            <p className="aggregation-status-pending">An export is being generated.</p>
            <p>This process may take a while.<br/>Check your email for updates.</p>
          </>
        )}
        {aggregation.status === 'completed' && (
          <>
            <p className="aggregation-status-completed"><span className="fa fa-check-circle-o" /> Successful Export.</p>
            <p>Completed {updatedTime.toLocaleString()}</p>
          </>
        )}
        {!['pending', 'completed'].includes(aggregation.status) && (
          <p>Status: {aggregation.status}</p>
        )}
      </div>
      <div className="aggregation-controls">
        <button
          className="button delete-button"
          onClick={deleteAggregation}
        >
          Delete <span className="fa fa-trash" />
        </button>
        {aggregation.status === 'completed' && (
          <a
            className="button download-button"
            href={linkForZip}
          >
            Download <span className="fa fa-download" />
          </a>
        )}
      </div>
    </li>
  );
}

export default AggregationItem;