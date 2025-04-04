import TaskHeader from '../components/TaskHeader.jsx'
import TaskInstructionField from '../components/TaskInstructionField.jsx'

const DEFAULT_HANDLER = () => {}

export default function UnknownTask({
  deleteTask = DEFAULT_HANDLER,
  task,
  taskKey
}) {
  const title = 'Unknown Task'

  return (
    <div className="text-task">
      <TaskHeader
        task={task}
        taskKey={taskKey}
        title={title}
      >
        <p>We're sorry, but the task type "{task?.type}" isn't recognised by the editor. Please contact the Zooniverse team to see if they can help figure out what's wrong.</p>
      </TaskHeader>

      <TaskInstructionField
        deleteTask={deleteTask}
        setValue={DEFAULT_HANDLER}
        showDeleteButton={true}
        taskKey={taskKey}
        update={DEFAULT_HANDLER}
        value={`ERROR: unknown task type "${task?.type}"`}
      />
    </div>
  )
}
