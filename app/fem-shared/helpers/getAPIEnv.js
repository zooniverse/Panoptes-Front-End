/*
Determines which environment (production or staging) should be used when
contacting our Zooniverse API endpoints.

- Returns either "staging" or "production"
- Tries to (mostly) match PJC's "env"-deciding logic:
  https://github.com/zooniverse/panoptes-javascript-client/blob/721b696/lib/config.js#L60-L69 
- This means that getAPIEnv() will respect PJC overrides, i.e. adding
  ?env=production to the URL will force both PJC and this function to use the
  'production' environment.
 */

const DEFAULT_ENV = 'staging';

export default function getAPIEnv() {
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