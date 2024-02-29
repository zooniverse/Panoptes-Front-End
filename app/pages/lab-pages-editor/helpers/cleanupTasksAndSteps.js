/*
Clean up tasks and steps.
- TODO: Remove steps without tasks.
- TODO: Remove tasks not associated with any step.
- Remove orphaned references in branching tasks.

- Returns { tasks, steps }
 */

import linkStepsInWorkflow from './linkStepsInWorkflow.js';

export default function cleanupTasksAndSteps(tasks = {}, steps = []) {
  const newTasks = structuredClone(tasks);  // Copy tasks
  const newSteps = steps.slice();  // Copy steps

  const taskKeys = Object.keys(newTasks);
  const stepKeys = newSteps.map(step => step[0]);

  // Remove orphaned references in branching tasks.
  Object.values(newTasks).forEach(taskBody => {
    taskBody?.answers?.forEach(answer => {
      // If the branching answer points to a non-existent Task Key or Step Key, remove the 'next'.
      if (answer.next && !taskKeys.includes(answer.next) && !stepKeys.includes(answer.next)) {
        delete answer.next;
      }
    })
  });

  // Remember to re-link steps to close gaps created by missing Steps.
  const newStepsLinked = linkStepsInWorkflow(newSteps, newTasks);

  return { tasks: newTasks, steps: newStepsLinked };
}
