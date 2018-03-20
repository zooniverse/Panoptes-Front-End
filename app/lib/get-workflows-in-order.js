import getAllLinked from './get-all-linked';

function getWorkflowsInOrder(project, query) {
  query = query || {};
  const order = (project.configuration && project.configuration.workflow_order) ?
    project.configuration.workflow_order :
    [];

  return getAllLinked(project, 'workflows', query).then((workflows) => {
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
  })
  .catch((error) => {
    console.info(error);
    return Promise.resolve([]);
  });
}

export default getWorkflowsInOrder;
