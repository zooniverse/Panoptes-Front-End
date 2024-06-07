/*
Checks if a step can branch. We're not asking if the step IS branching, but if it *can.*
- If yes, returns Task ID of the Task that's causing the branch.
  - If multiple Tasks qualify, only return the FIRST.
  - NOTE: as of Jun 2024, if a step has multiple single-type tasks, only the first is "actually" a branching task that decides the branching logic of the FEM classifier.
- If no, returns false.
 */
export default function checkCanStepBranch(step = [], tasks = {}) {
  // TODO/CHECK: if a Question Task has 0 answers, is it still considered 'branching'? Check what happens with FEM Classifier
  const [stepId, stepBody] = step;
  const tasksInStep = stepBody?.taskKeys?.map(taskKey => tasks[taskKey] ? [taskKey, tasks[taskKey]]: undefined).filter(task => !!task) || []
  return tasksInStep.find(checkCanTaskBranch)?.[0] || false;
}

/*
Checks if a task can branch.
- Returns true or false.
- At the moment, only "Single Question" tasks can branch. 
- Compare with "isTaskBranching" in https://github.com/zooniverse/front-end-monorepo/blob/master/packages/lib-classifier/src/store/helpers/convertWorkflowToUseSteps/convertWorkflowToUseSteps.js
 */
function checkCanTaskBranch([taskKey, task]) {
  return task?.type === 'single';
}
