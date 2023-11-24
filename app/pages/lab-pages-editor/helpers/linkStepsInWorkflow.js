/*
Links Steps in a Workflow together.

- Input: array of Steps, and Tasks object.
- Output: COPY of array of Steps, with their `step.next`s updated.

Rules for linking steps:
- If a Step *can* branch, then step.next = undefined.
- If a Step is the final step in the array, then step.next = undefined. 
- Otherwise, each Step's step.next will be the ID of the next Step in the array.
 */

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

/*
Checks if a step can branch. We're not asking if the step IS branching, but if it *can.*
- If yes, returns Task ID of the Task that's causing the branch.
  - If multiple Tasks qualify, only return the FIRST.
- If no, returns false.
 */
function canStepBranch(step = [], tasks = {}) {
  // TODO/QUESTION: what happens when a Step has multiple branching Questions?
  // TODO/CHECK: if a Question Task has 0 answers, is it still considered 'branching'? Check what happens with FEM Classifier
  const [stepId, stepBody] = step;
  const tasksInStep = stepBody?.taskKeys?.map(taskKey => tasks[taskKey] ? [taskKey, tasks[taskKey]]: undefined).filter(task => !!task) || []
  return tasksInStep.find(canTaskBranch)?.[0] || false;
}

/*
Checks if a task can branch.
- Returns true or false.
- At the moment, only "Single Question" tasks can branch. 
- Compare with "isTaskBranching" in https://github.com/zooniverse/front-end-monorepo/blob/master/packages/lib-classifier/src/store/helpers/convertWorkflowToUseSteps/convertWorkflowToUseSteps.js
 */
function canTaskBranch([taskKey, task]) {
  return task?.type === 'single';
}
