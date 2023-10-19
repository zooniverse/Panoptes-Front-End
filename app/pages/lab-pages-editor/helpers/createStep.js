/*
Creates a Step, with tasks, that's ready to be inserted into a Workflow.
 */

export default function createStep(stepKey, taskKeys = []) {
  return [stepKey, { taskKeys }];
}
