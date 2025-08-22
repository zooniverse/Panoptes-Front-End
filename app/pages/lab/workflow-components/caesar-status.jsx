/*
Caesar Status Indicator

Indicates if a given Panoptes workflow resource has a corresponding workflow
configuration on Caesar.
 */

import { useEffect, useState } from 'react';
import auth from 'panoptes-client/lib/auth';

const DEFAULT_API_DATA = {
  caesar: undefined,
  status: 'ready'
};

const env = getAPIEnv();

function getCaesarStatusUrl (workflowId = 0) {
  if (!workflowId) return;

  return (env === 'production')
    ? `https://caesar.zooniverse.org/workflows/${parseInt(workflowId)}`
    : `https://caesar-staging.zooniverse.org/workflows/${parseInt(workflowId)}`  
}

export default function CaesarStatus ({ workflow }) {
  const [apiData, setApiData] = useState(DEFAULT_API_DATA);

  async function checkCaesar () {
    try {
      setApiData({
        caesar: undefined,
        status: 'fetching'
      });

      console.log('+++ fetching 1... ');
      const caesarData = {};

      const bearerToken = await auth.checkBearerToken();
      console.log('+++ bearerToken', bearerToken);

      const url = getCaesarStatusUrl(workflow.id);
      const headers = {
        authorization: (bearerToken) ? `Bearer ${bearerToken}` : ''
      }

      const res = await fetch(url, { headers });
      console.log('+++ res', res)
      if (res?.status !== 200) throw new Error('no-data');

      setApiData({
        caesar: caesarData,
        status: 'success'
      });

    } catch (err) {
      // On failure... it's kinda expected. A workflow with no Caesar config returns a 404.
      console.log('+++ Error: ', err)
      setApiData({
        caesar: undefined,
        status: 'no-data'
      });
    }
  }

  useEffect(checkCaesar, [workflow.id]);

  if (!workflow) return;

  const caesarConfigUrl = (env === 'production')
    ? `https://caesar.zooniverse.org/workflows/${parseInt(workflow.id)}`
    : `https://caesar-staging.zooniverse.org/workflows/${parseInt(workflow.id)}`;

  return (
    <div className="caesar-status">
      <span class="form-label">👑 Caesar Status</span>

      {apiData.status === 'fetching' && (<p>Checking...</p>)}
      {apiData.status === 'no-data' && (<p>✖ Nothing in Caesar, sorry.</p>)}
      {apiData.status === 'success' && (<p>✅ This workflow has <a href={caesarConfigUrl}>a Caesar config!</a></p>)}
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