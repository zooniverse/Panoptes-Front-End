import taskComponents from '../../../classifier/tasks/index.js';

function TaskOption({ definition, taskKey}) {
  if (definition.type !== 'shortcut') {
    return (
      <option key={taskKey} value={taskKey}>
        {taskKey}: {taskComponents[definition.type]?.getTaskText(definition)?.substring(0, 100)}
      </option>
    );
  }
  return null;
}

export default function TaskOptions({ tasks }) {
  const taskEntries = Object.entries(tasks);
  return taskEntries.map(([taskKey, definition]) => <TaskOption key={taskKey} taskKey={taskKey} definition={definition} />);
}
