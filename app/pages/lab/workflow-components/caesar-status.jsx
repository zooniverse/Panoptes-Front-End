/*
Caesar Status Indicator

Indicates if a given Panoptes workflow resource has a corresponding workflow
configuration on Caesar.
 */

import { useEffect, useState } from 'react';
import { gql, GraphQLClient } from 'graphql-request';

function getCaesarClient (env) {
  switch (env) {
    case 'production': {
      return new GraphQLClient('https://caesar.zooniverse.org/graphql')
    }
    default: {
      return new GraphQLClient('https://caesar-staging.zooniverse.org/graphql')
    }
  }
}

const caesarClient = getCaesarClient(getAPIEnv());

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

      console.log('+++ fetching 1... ');

      const query = gql`{
        workflow(id: ${parseInt(workflow.id)}) {
          id
        }
      }`

      console.log('+++ fetching 2... ');

      const caesarData = await caesarClient.request(query);

      console.log('+++ fetched: ', caesarData);

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

  const env = getAPIEnv();
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