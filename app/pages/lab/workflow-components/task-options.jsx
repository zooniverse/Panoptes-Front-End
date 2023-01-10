import taskComponents from '../../../classifier/tasks/index.js';

function TaskOption({ definition, taskKey }) {
  if (definition.type !== 'shortcut') {
    return (
      <option key={taskKey} value={taskKey}>
        {taskComponents[definition.type]?.getTaskText(definition)}
      </option>
    );
  }
  return null;
}

export default function TaskOptions({ tasks }) {
  const taskEntries = Object.entries(tasks);
  return taskEntries.map(([taskKey, definition]) => <TaskOption taskKey={taskKey} definition={definition} />);
}
