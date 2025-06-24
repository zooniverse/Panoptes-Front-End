const DEFAULT_ENV = 'development'

export default function getEnv() {
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