/*
Clean up tasks and steps.
- Remove steps without tasks.
- Remove tasks not associated with any step.
- Remove orphaned references in branching tasks.
- Remove orphaned references in steps.

- Returns { tasks, steps }
 */

export default function cleanupTasksAndSteps(tasks = {}, steps = []) {
  const newTasks = structuredClone(tasks);  // Copy tasks.
  let newSteps = structuredClone(steps);  // Copy steps. This is a deep copy, compared to steps.slice()

  // Remove steps without tasks.
  newSteps = newSteps.filter(step => step?.[1]?.taskKeys?.length > 0);

  // Remove tasks not associated with any step.
  Object.keys(newTasks).forEach(taskKey => {
    let existsInAnyStep = false;
    newSteps.forEach(step => {
      existsInAnyStep = existsInAnyStep || !!step?.[1]?.taskKeys?.includes(taskKey);
    });
    if (!existsInAnyStep) delete newTasks[taskKey];
  });

  const taskKeys = Object.keys(newTasks);
  const stepKeys = newSteps.map(step => step[0]);

  // Remove orphaned references in branching tasks.
  Object.values(newTasks).forEach(task => {
    task?.answers?.forEach(answer => {
      // If the branching answer points to a non-existent Task Key or Step Key, remove the 'next'.
      if (answer.next && !taskKeys.includes(answer.next) && !stepKeys.includes(answer.next)) {
        delete answer.next;
      }
    });
  });
  
  // Remove orphaned references in steps.
  newSteps = newSteps.map(step => {
    // If the stepBody points to a non-existent Task Key or Step Key, remove the 'next'.
    const [stepKey, stepBody] = step;
    if (stepBody.next && !taskKeys.includes(stepBody.next) && !stepKeys.includes(stepBody.next)) {
      delete stepBody.next;
    }
    return [ stepKey, stepBody ]
  })

  return { tasks: newTasks, steps: newSteps };
}
