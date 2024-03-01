/*
Figures out of the "Preview Workflow" link requires "?env=staging" or
"?env=production"
 */
export default function getPreviewEnv() {
  const hostname = window?.location?.hostname || '';
  const params = new URLSearchParams(window?.location?.search);
  const explicitEnv = params.get('env');

  // If an explicit ?env=... is specified, use that.
  if (explicitEnv) return `?env=${explicitEnv}`;

  // The following URLs default to using staging:
  // https://local.zooniverse.org:3735/lab/1982/workflows/editor/3711
  // https://pr-7046.pfe-preview.zooniverse.org/lab/1982/workflows/editor/3711?env=staging
  if (hostname.match(/^(local|.*\.pfe-preview)\.zooniverse\.org$/ig)) {
    return '?env=staging'
  }

  return '';
}