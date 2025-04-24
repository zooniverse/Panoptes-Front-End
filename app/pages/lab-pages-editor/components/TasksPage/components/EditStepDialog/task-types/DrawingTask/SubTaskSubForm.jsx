import PropTypes from 'prop-types'

import QuestionTask from '../QuestionTask.jsx'
import TextTask from '../TextTask.jsx'
import UnknownTask from '../UnknownTask.jsx'

const DEFAULT_HANDLER = () => {}

const taskTypes = {
  'multiple': QuestionTask,  // Shared with single answer question task
  'single': QuestionTask,
  'text': TextTask
}

function SubTaskSubForm({
  deleteTask = DEFAULT_HANDLER,
  subTaskIndex,
  task,
  updateTask = DEFAULT_HANDLER,
}) {
  const TaskForm = taskTypes[task?.type] || UnknownTask

  return (
    <li className="subtask">
      <TaskForm
        deleteTask={deleteTask}
        isSubTask={true}
        stepHasManyTasks={false}
        task={task}
        taskKey={subTaskIndex}
        updateTask={updateTask}
      />
    </li>
  )
}

SubTaskSubForm.propTypes = {
  deleteTask: PropTypes.func,
  subTaskIndex: PropTypes.string,
  task: PropTypes.object,
  updateTask: PropTypes.func
}

export default SubTaskSubForm
