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

function getAggStatusSymbol (aggStatus) {
  switch (aggStatus) {
    case 'pending': return '🟡';
    case 'completed': return '🟢';
    default: return '⚪️';
  }
}

const DEFAULT_HANDLER = () => {};

function AggregationItem ({
  aggregation,
  onDelete = DEFAULT_HANDLER
}) {
  const [apiData, setApiData] = useState({
    status: 'ready'
  });

  function reset () {
    setApiData({
      status: 'ready'
    });
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
    
    } catch (err) {
      onError(err);
    }
  }

  if (!aggregation) return null;

  if (['deleting', 'deleted', 'error'].includes(apiData.status)) {
    return (
      <li className="aggregation-item">
        <div className={`message ${apiData.status === 'error' ? 'error' : ''}`}>
          {apiData.status === 'deleting' && 'Deleting...'}
          {apiData.status === 'deleted' && 'Deleted'}
          {apiData.status === 'error' && 'Error'}
        </div>
      </li>
    );
  }

  const env = getAPIEnv();

  // Aggregations data, if any.
  const updatedTime = new Date(aggregation.updated_at);
  const linkForZip = `https://aggregationdata.blob.core.windows.net/${env}/${aggregation.uuid}/${aggregation.links?.workflow}_aggregation.zip`;
  // const linkForCsv = `https://aggregationdata.blob.core.windows.net/${env}/${aggregation.uuid}/${aggregation.links?.workflow}_reductions.csv`;

  return (
    <li className="aggregation-item">
      <div>Aggregation #{aggregation.id} for Workflow {aggregation.links?.workflow}</div>
      <div>{getAggStatusSymbol(aggregation.status)} {aggregation.status}</div>
      <div>Updated {updatedTime.toLocaleString()}</div>
      <div className="flex-row">
        <button onClick={deleteAggregation}>❌ Delete</button>
        <span className="spacer" />
        {aggregation.status === 'completed' && (
          <a className="plain button" href={linkForZip}>[⬇️ Download]</a>
        )}
      </div>
    </li>
  );
}

export default AggregationItem;