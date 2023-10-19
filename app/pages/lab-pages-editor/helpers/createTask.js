/*
Creates an empty/placeholder Task that's ready to be inserted into a Workflow.
NOTE: the Task Key isn't handled by this function. Whatever's calling this
function needs to assign the appropriate Task Key to this Task, and then add it
to the Workflow.
 */

export default function createTask(taskType = 'text') {
  // TODO
  // Placeholder only
  return {
    help: '',
    instruction: 'This is an example Text Task.',
    required: false,
    type: 'text'
  };
}
