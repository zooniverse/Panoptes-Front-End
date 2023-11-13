/*
Links Steps in a Workflow together.

- Input: array of Steps
- Output: copy of array of Steps, with their `step.next`s updated.

Rules for linking steps:
- If a Step is branching, then step.next = undefined.
- If a Step is the final step in the array, then step.next = undefined. 
- Otherwise, each Step's step.next will be the ID of the next Step in the array.
 */

export default function linkStepsInWorkflow(steps = []) {
  const newSteps = [];

  return newSteps;
}

/*
Checks if a step is branching.
- If yes, returns Task ID of the Task that's causing the branch.
- If no, returns false.
 */
function isStepBranching(step) {
  // TODO: actually implement the darn check
  // FEM's convertWorkflowToUseSteps has a method for checking if a Task is branching (isThereBranching())
  // https://github.com/zooniverse/front-end-monorepo/blob/master/packages/lib-classifier/src/store/helpers/convertWorkflowToUseSteps/convertWorkflowToUseSteps.js
  // QUESTION: what happens when a Step has multiple branching Questions?
  return false;
}
