var apiClient = require('panoptes-client/lib/api-client');

var workflows = apiClient.type('workflows');

var workflowActions = {
  createWorkflow: function(workflowData, sourceWorkflow) {
    var allWorkflowData = {}
    if (sourceWorkflow === null) {
      allWorkflowData = Object.assign({
        tasks: {init: {
          type: 'single',
          question: 'Ask your first question here.',
          answers: [{label: 'Yes'}]
        }},
        first_task: 'init'
      }, workflowData);
    } else {
      allWorkflowData = Object.assign({
        tasks: sourceWorkflow.tasks,
        first_task: sourceWorkflow.first_task,
        configuration: sourceWorkflow.configuration,
        retirement: sourceWorkflow.retirement
      }, workflowData);
    }

    return workflows.create(allWorkflowData).save();
  }
}

module.exports = workflowActions;
