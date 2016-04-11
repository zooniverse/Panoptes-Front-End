var apiClient = require('panoptes-client/lib/api-client');
var counterpart = require('counterpart');

var workflows = apiClient.type('workflows');

var workflowActions = {
  createWorkflow: function(workflowData) {
    var allWorkflowData = Object.assign({
      primary_language: counterpart.getLocale()
    }, workflowData);

    return workflows.create(allWorkflowData).save();
  }
}

module.exports = workflowActions;
