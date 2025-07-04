/*
Searches the Workflow's existing Tasks and finds the next available Task Key.
- Goes through workflow.tasks and finds keys in the format of T0, T1, T2, etc
- Finds the LARGEST/HIGHEST key and returns one higher.
- e.g. if given [T0, T1, T5], this will return "T6".
- Return "T0" by default.

Also:
- optionalOffset allow the returned Task Key to be adjusted by a value - this
  is useful if you're creating multiple Tasks at the same time before updating
  the 'tasks' object.
 */

import { TASK_KEY_PREFIX } from './constants.js'
import convertKeyToIndex from './convertKeyToIndex.js'

export default function getNewTaskKey(tasks = {}, optionalOffset = 0) {
  let newIndex = 0
  const taskKeys = Object.keys(tasks)
  taskKeys.forEach((taskKey) => {
    const index = convertKeyToIndex(taskKey)
    newIndex = (newIndex <= index) ? index + 1 : newIndex
  })
  newIndex += optionalOffset
  return `${TASK_KEY_PREFIX}${newIndex}`
}
