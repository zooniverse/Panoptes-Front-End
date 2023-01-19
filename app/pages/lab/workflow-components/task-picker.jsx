import taskComponents from '../../../classifier/tasks';
import TaskIcon from './task-icon.jsx';

function TaskButton({ active, definition, firstTask, onClick, value }) {
  const taskDefinition = taskComponents[definition.type]?.getTaskText(definition);
  const classNames = ['secret-button', 'nav-list-item'];

  function selectTask() {
    onClick(value)
  }

  return (
    <div>
      <button
        aria-pressed={ active ? 'true' : 'false' }
        type="button"
        className={classNames.join(' ')}
        name="selectedTask"
        value={value}
        onClick={selectTask}
      >
        <TaskIcon type={definition.type} />
        {' '}
        {taskDefinition || 'Task editor is unavailable'}
        {firstTask ? <small> <em>(first)</em></small> : undefined}
        <small style={{float: 'right'}}>{value}</small>
      </button>
    </div>
  );
}

export default function TaskPicker({ onClick, selectedTaskKey, workflow }) {
  const result = [];
  const taskEntries = Object.entries(workflow.tasks);
  return taskEntries.map(function taskButton(taskEntry) {
    const [key, definition] = taskEntry;
    const active = key === selectedTaskKey;
    if (definition.type !== 'shortcut') {
      return (
        <TaskButton
          key={key}
          active={active}
          definition={definition}
          firstTask={key === workflow.first_task}
          onClick={onClick}
          value={key}
        />
      );
    }
  });
}