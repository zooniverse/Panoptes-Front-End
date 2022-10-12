var apiClient = require('panoptes-client/lib/api-client');

var projects = apiClient.type('projects');
var workflows = apiClient.type('workflows');

var workflowActions = {
  createWorkflowForProject: function(project, workflowData) {
    var allWorkflowData = Object.assign({
      links: {project: project.id}
    }, workflowData);

    return workflows.create(allWorkflowData).save();
  },
  copyWorkflowForProject: async function(project, workflowData) {
    const oldLinks = new Set(project.links.workflows);
    const [newProject] = await project.addLink('workflows', [workflowData.id]);
    const newLinks = newProject?.links
    const newWorkflowID = newLinks?.workflows.find(workflowID => !oldLinks.has(workflowID));
    if (!newWorkflowID) {
      return Promise.reject(new Error('no new workflow links on project.'))
    }
    const newWorkflow = await workflows.get(newWorkflowID)
    await newWorkflow.update({ display_name: workflowData.display_name }).save();
    return newWorkflow;
  }
}

module.exports = workflowActions;
