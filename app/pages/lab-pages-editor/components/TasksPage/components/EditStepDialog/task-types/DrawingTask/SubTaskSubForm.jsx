import QuestionTask from '../QuestionTask.jsx'
import TextTask from '../TextTask.jsx'
import UnknownTask from '../UnknownTask.jsx'

const DEFAULT_HANDLER = () => {}

const taskTypes = {
  'multiple': QuestionTask,  // Shared with single answer question task
  'single': QuestionTask,
  'text': TextTask
}

function SubTaskSubForm({ task }) {
  const TaskForm = taskTypes[task?.type] || UnknownTask

  const deleteTask = DEFAULT_HANDLER
  const enforceLimitedBranchingRule = false
  const stepHasManyTasks = false
  const taskKey = ''
  const updateTask = DEFAULT_HANDLER

  return (
    <li id="subtask">
      <TaskForm
        deleteTask={deleteTask}
        enforceLimitedBranchingRule={enforceLimitedBranchingRule}
        stepHasManyTasks={stepHasManyTasks}
        task={task}
        taskKey={taskKey}
        updateTask={updateTask}
      />
    </li>
  )
}

export default SubTaskSubForm
