const apiClient = require('panoptes-client/lib/api-client');

const projects = apiClient.type('projects');
const workflows = apiClient.type('workflows');

const workflowActions = {
  createWorkflowForProject(project, workflowData) {
    const allWorkflowData = Object.assign({
      links: { project: project.id }
    }, workflowData);

    return workflows.create(allWorkflowData).save();
  },
  async copyWorkflowForProject(project, workflowData) {
    const oldLinks = new Set(project.links.workflows);
    const [newProject] = await project.addLink('workflows', [workflowData.id]);
    const newLinks = newProject?.links.workflows;
    const newWorkflowID = newLinks?.find(workflowID => !oldLinks.has(workflowID));
    if (!newWorkflowID) {
      return Promise.reject(new Error('no new workflow links on project.'));
    }
    const newWorkflow = await workflows.get(newWorkflowID);
    await newWorkflow.update({ display_name: workflowData.display_name }).save();
    return newWorkflow;
  }
};

module.exports = workflowActions;
