function getWorkflowsInOrder(project, query) {
  query = query || {};
  const order = (project.configuration && project.configuration.workflow_order) ?
    project.configuration.workflow_order :
    [];

  // TODO remove default page_size once pagination solution implemented
  query.page_size = query.page_size || 100;

  return project.get('workflows', query).then((workflows) => {
    const workflowsByID = {};
    workflows.forEach((workflow) => { workflowsByID[workflow.id] = workflow; });

    const workflowsInOrder = order.map(workflowID => workflowsByID[workflowID]).filter(Boolean);

    // Append any workflows that exist but do not appear in the order.
    workflows.forEach((workflow) => {
      if (workflowsInOrder.indexOf(workflow) === -1) {
        workflowsInOrder.push(workflow);
      }
    });

    return workflowsInOrder;
  });
}

export default getWorkflowsInOrder;
