/*
Links Steps in a Workflow together.

- Input: array of Steps, and Tasks object.
- Output: COPY of array of Steps, with their `step.next`s updated.

Rules for linking steps:
- If a Step *can* branch, then step.next = undefined.
- If a Step is the final step in the array, then step.next = undefined. 
- Otherwise, each Step's step.next will be the ID of the next Step in the array.
 */

import canStepBranch from './canStepBranch.js';

export default function linkStepsInWorkflow(steps = [], tasks = {}) {
  const newSteps = steps.map((step, index) => {
    const [stepId, stepBody] = step;

    const isFinalStepInArray = index === (steps.length - 1);
    const canBranch = canStepBranch(step, tasks);
    const nextStep = (isFinalStepInArray || canBranch) ? undefined : steps[index+1]?.[0];

    const newStepBody = {
      ...stepBody,
      next: nextStep
    };

    return [stepId, newStepBody];
  })

  return newSteps;
}
