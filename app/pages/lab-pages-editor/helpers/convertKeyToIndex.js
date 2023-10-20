/*
Transforms "T1234" (string) to 1234 (number).
Returns 0 by default.
 */
/* eslint-disable radix */

export default function convertKeyToIndex(taskKeyOrStepKey = '') {
  const indexStr = taskKeyOrStepKey?.replace(/^(\D)+/g, '');
  return parseInt(indexStr) || 0;
}
