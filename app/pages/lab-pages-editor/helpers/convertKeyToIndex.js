/*
Transforms "T1234" (string) to 1234 (number).
Returns 0 by default.
 */
/* eslint-disable radix */

import { TASK_KEY_PREFIX, STEP_KEY_PREFIX } from './constants.js';

export default function convertKeyToIndex(taskKeyOrStepKey = '') {
  // regular expression looks like /^(?:T|P)(\d+)$/ - only the '\d+' is captured.
  const re = RegExp(`^(?:${TASK_KEY_PREFIX}|${STEP_KEY_PREFIX})(\\d+)$`);
  const indexStr = taskKeyOrStepKey?.match(re)?.[1]; // [1] is the '\d+' capture group.
  return parseInt(indexStr) || 0;
}
