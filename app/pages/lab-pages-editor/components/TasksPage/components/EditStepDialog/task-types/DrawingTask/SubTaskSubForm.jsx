import QuestionTask from '../QuestionTask.jsx'
import TextTask from '../TextTask.jsx'
import UnknownTask from '../UnknownTask.jsx'

const DEFAULT_HANDLER = () => {}

const taskTypes = {
  // 'multiple': QuestionTask,  // Shared with single answer question task
  // 'single': QuestionTask,
  'text': TextTask
}

function SubTaskSubForm({ task }) {
  const TaskForm = taskTypes[task?.type] || UnknownTask

  const deleteTask = DEFAULT_HANDLER
  const taskKey = ''
  const updateTask = DEFAULT_HANDLER

  return (
    <li className="subtask">
      <TaskForm
        deleteTask={deleteTask}
        isSubTask={true}
        stepHasManyTasks={false}
        task={task}
        taskKey={taskKey}
        updateTask={updateTask}
      />
    </li>
  )
}

export default SubTaskSubForm
