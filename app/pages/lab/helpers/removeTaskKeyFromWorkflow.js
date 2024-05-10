export default function removeTaskKeyFromWorkflow(workflow, taskKey) {
    const changes = {};
    Object.entries(workflow.tasks).forEach(([key, task]) => {
      if (task.next === taskKey) {
        changes[`tasks.${key}.next`] = '';
      }
      task.answers?.forEach((answer, index) => {
        if (answer.next === taskKey) {
          changes[`tasks.${key}.answers.${index}.next`] = '';
        }
      });
    });
    return workflow.update(changes);
}
