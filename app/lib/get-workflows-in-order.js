function getWorkflowsInOrder(project, query) {
  query = query || {};
  const order = (project.configuration && project.configuration.workflow_order) ?
    project.configuration.workflow_order :
    [];

  function getAllWorkflows(query) {
    let allWorkflows = [];
    return getWorkflows(query, 1);

    function getWorkflows(query, page) {
      return project.get('workflows', Object.assign({}, query, { page }))
        .then((workflows) => {
          allWorkflows = allWorkflows.concat(workflows);
          const meta = workflows[0] ? workflows[0].getMeta() : null;
          if (meta && meta.next_page) {
            return getWorkflows(query, meta.next_page);
          }
        })
        .catch((error) => {
          console.info(error);
        })
        .then(() => Promise.resolve(allWorkflows));
    }
  }

  return getAllWorkflows(query).then((workflows) => {
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
