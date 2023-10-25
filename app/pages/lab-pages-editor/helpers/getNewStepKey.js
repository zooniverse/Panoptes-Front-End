/*
Searches the Workflow's existing Steps and finds the next available Step Key.
- Goes through workflow.steps and finds steps in the format of P0, P1, P2, etc
- Finds the LARGEST/HIGHEST key and returns one higher.
- e.g. if given [P0, P1, P5], this will return P6.
- Return P0 by default.
 */

import { STEP_KEY_PREFIX } from './constants.js';
import convertKeyToIndex from './convertKeyToIndex.js';

export default function getNewStepKey(steps = []) {
  let newIndex = 0;
  const stepKeys = steps.map((step) => (step[0] || '')).filter((step) => (step.length > 0));
  stepKeys.forEach((stepKey) => {
    const index = convertKeyToIndex(stepKey);
    newIndex = (newIndex <= index) ? index + 1 : newIndex;
  });
  return `${STEP_KEY_PREFIX}${newIndex}`;
}
