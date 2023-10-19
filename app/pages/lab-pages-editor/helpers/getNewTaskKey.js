/*
Searches the Workflow's existing Tasks and finds the next available Task Key.
- Goes through workflow.tasks and finds keys in the format of T0, T1, T2, etc
- Finds the LARGEST/HIGHEST key and returns one higher.
- e.g. if given [T0, T1, T5], this will return T6.
- Return T0 by default.
 */

import { TASK_KEY_PREFIX } from './constants.js';
import convertKeyToIndex from './convertKeyToIndex.js';

export default function getNewTaskKey(tasks = {}) {
  let newIndex = 0;
  const taskKeys = Object.keys(tasks);
  taskKeys.forEach((taskKey) => {
    const index = convertKeyToIndex(taskKey);
    newIndex = (newIndex <= index) ? index + 1 : newIndex;
  });
  return `${TASK_KEY_PREFIX}${newIndex}`;
}
