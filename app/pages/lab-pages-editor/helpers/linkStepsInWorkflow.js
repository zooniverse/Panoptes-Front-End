/*
Links Steps in a Workflow together.

- Input: array of Steps, and Tasks object.
- Output: COPY of array of Steps, with their `step.next`s updated.

Rules for linking steps:
- If a Step is branching, then step.next = undefined.
- If a Step is the final step in the array, then step.next = undefined. 
- Otherwise, each Step's step.next will be the ID of the next Step in the array.
 */

export default function linkStepsInWorkflow(steps = [], tasks = {}) {
  const newSteps = steps.map((step, index) => {
    const [stepId, stepBody] = step;

    const isFinalStep = index >= (steps.length - 1);
    const isBranching = isStepBranching(step, tasks);
    const nextStep = (isFinalStep || isBranching) ? undefined : steps[index+1]?.[0];

    const newStepBody = {
      ...stepBody,
      next: nextStep
    };

    return [stepId, newStepBody];
  })

  return newSteps;
}

/*
Checks if a step is branching.
- If yes, returns Task ID of the Task that's causing the branch.
- If no, returns false.
 */
function isStepBranching(step, tasks) {
  // TODO: actually implement the darn check
  // FEM's convertWorkflowToUseSteps has a method for checking if a Task is branching (isThereBranching())
  // https://github.com/zooniverse/front-end-monorepo/blob/master/packages/lib-classifier/src/store/helpers/convertWorkflowToUseSteps/convertWorkflowToUseSteps.js
  // QUESTION: what happens when a Step has multiple branching Questions?
  return false;
}
