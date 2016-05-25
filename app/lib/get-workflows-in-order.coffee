getWorkflowsInOrder = (project) ->
  console.log {project}
  order = project.configuration?.workflow_order ? []

  project.get('workflows').then (workflows) ->
    workflowsByID = {}
    workflows.forEach (workflow) ->
      workflowsByID[workflow.id] = workflow

    workflowsInOrder = order.map (workflowID) ->
      workflowsByID[workflowID]

    # Filter out any workflows that appear in the order but do not actually exist.
    workflowsInOrder = workflowsInOrder.filter Boolean

    # Append any workflows that exist but do not appear in the order.
    workflows.forEach (workflow) ->
      if workflow not in workflowsInOrder
        workflowsInOrder.push workflow

    workflowsInOrder

module.exports = getWorkflowsInOrder
