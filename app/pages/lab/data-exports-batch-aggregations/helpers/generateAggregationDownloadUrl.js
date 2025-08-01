/*
Generate Download URL for Completed Aggregations
When a batch aggregation data export job reaches the "completed" state, its data
files are ready for download. These files are stored on our Azure servers, and
the URL can be _extrapolated_ from the aggregation UUID, workflow ID, and the
environment.

See additional docs in PFE issue 7326 for more details on how this URL is
defined. Check with the backend team if you have additional queries.
https://github.com/zooniverse/Panoptes-Front-End/issues/7326

A batch aggregation data export job actually generates TWO files, a
reductions CSV and an aggregations ZIP. The ZIP appears to contain the
reductions CSV, so usually we'd only offer the more comprehensive ZIP file to
users.

Input:
- aggregation: batch aggregation data export (Panoptes resource object)
- env: the environment the aggregation exists in (string)
- fileType: the either 'zip' or 'csv'.

Output:
- the URL of the requested data file (string)
- undefined if input was invalid.
 */

export default function generateAggregationDownloadUrl (aggregation, env, fileType = 'zip') {
  if (
    !aggregation
    || !['staging', 'production'].includes(env)
    || !['zip', 'csv'].includes(fileType)
  ) return;

  let fileSuffix = (fileType === 'zip')
    ? '_aggregation.zip'
    : '_reductions.csv';

  return `https://aggregationdata.blob.core.windows.net/${env}/${aggregation.uuid}/${aggregation.links?.workflow}${fileSuffix}`;
}