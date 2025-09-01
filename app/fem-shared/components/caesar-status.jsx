/*
Caesar Status Indicator

Indicates if a given Panoptes workflow resource has a corresponding workflow
configuration on Caesar.
 */

import { useEffect, useState } from 'react';
import auth from 'panoptes-client/lib/auth';
import getCaesarWorkflowUrl from '../helpers/getCaesarWorkflowUrl.js'

const DEFAULT_API_DATA = {
  caesar: undefined,
  status: 'ready'
};

export default function CaesarStatus ({ workflow }) {
  const [apiData, setApiData] = useState(DEFAULT_API_DATA);

  async function checkCaesar () {
    try {
      setApiData({
        caesar: undefined,
        status: 'fetching'
      });

      const bearerToken = await auth.checkBearerToken();
      const url = getCaesarWorkflowUrl(workflow?.id);
      const headers = {
        Accept: 'application/json',
        Authorization: (bearerToken) ? `Bearer ${bearerToken}` : '',
        'Content-Type': 'application/json',
      }

      const res = await fetch(url, { headers });
      if (res?.status !== 200) throw new Error('no-data');

      const caesarData = await res.json();
      
      setApiData({
        caesar: caesarData,
        status: 'success'
      });

    } catch (err) {
      // On failure... it's kinda expected. A workflow with no Caesar config returns a 404.
      setApiData({
        caesar: undefined,
        status: 'no-data'
      });
    }
  }

  useEffect(checkCaesar, [workflow?.id]);

  if (!workflow) return null;

  const caesarWorkflowUrl = getCaesarWorkflowUrl(workflow?.id);

  return (
    <div className="caesar-status" data-status={apiData.status}>
      {apiData.status === 'fetching' && (
        <span
          aria-label="Checking Caesar..."
          className="fa fa-spinner fa-spin"
        />
      )}

      {apiData.status === 'no-data' && null}

      {apiData.status === 'success' && (
        <>
          <a
            className="caesar-status-badge"
            href={caesarWorkflowUrl}
          >
            <span className="caesar-status-badge-left">§</span>
            <span className="caesar-status-badge-center">Caesar</span>
            <span className="caesar-status-badge-right">§</span>
          </a>

          <span className="caesar-status-value">
            <span>Extractors</span>
            <span>{apiData?.caesar?.extractors_count ?? '?'}</span>
          </span>

          <span className="caesar-status-value">
            <span>Reducers</span>
            <span>{apiData?.caesar?.reducers_count ?? '?'}</span>
          </span>

          <span className="caesar-status-value">
            <span>Rules</span>
            <span>{apiData?.caesar?.subject_rules_count ?? '?'}</span>
          </span>
        </>
      )}
    </div>
  );
}

/*
Determines which environment (production or staging) should be used when
contacting our Caesar API endpoints.

2025.08.21
- This is actually a copy of app/pages/lab/data-exports-batch-aggregations/helpers/getAPIEnv.js
- We're making a copy because data-exports-batch-aggregations is meant to break
  away from the PFE code at some point in the future, and we don't want the
  Lab pages to implode if/when that folder's removed.

TODO: maybe centralise these shared functions to avoid duplication?
 */

const DEFAULT_ENV = 'staging'

function getAPIEnv () {
  const params = new URLSearchParams(window?.location?.search);
  const envFromShell = process.env.NODE_ENV;
  const envFromBrowser = params.get('env');

  let env = envFromBrowser || envFromShell || DEFAULT_ENV;
  
  if (!env.match(/^(production|staging|development)$/)) {
    throw new Error(`Error: Invalid Environment - ${env}`);
  }

  if (env === 'development') env = 'staging';
  return env;
}