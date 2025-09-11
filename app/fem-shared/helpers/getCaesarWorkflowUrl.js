/*
Gets the URL for the workflow config on Caesar.

Note that this URL on Caesar can be used in two ways:
- the URL itself can be used as a normal browser link, which leads to a webpage.
- if a GET request is performed with the correct Accept, Authorization, and
  Content-Type headers, then this endpoint returns a JSON response.

The first is useful for directing users to edit the workflow config on Caesar.
The second is useful to get the status of the workflow config, for use on _this_
web app.
 */

import getAPIEnv from './getAPIEnv.js';

const CURRENT_ENV = getAPIEnv();

export default function getCaesarWorkflowUrl (workflowId = 0, env = CURRENT_ENV) {
  if (!workflowId) return;

  return (env === 'production')
    ? `https://caesar.zooniverse.org/workflows/${parseInt(workflowId)}`
    : `https://caesar-staging.zooniverse.org/workflows/${parseInt(workflowId)}`  
}
