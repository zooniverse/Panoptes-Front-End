var apiClient = require('panoptes-client/lib/api-client');

var workflows = apiClient.type('workflows');

var workflowActions = {
  createWorkflowForProject: function(projectID, workflowData) {
    var allWorkflowData = Object.assign({
      links: {project: projectID}
    }, workflowData);

    return workflows.create(allWorkflowData).save();
  }
}

module.exports = workflowActions;
