import PropTypes from 'prop-types'

import DrawingTask from './task-types/DrawingTask/index.jsx'
import QuestionTask from './task-types/QuestionTask.jsx'
import TextTask from './task-types/TextTask.jsx'
import UnknownTask from './task-types/UnknownTask.jsx'

const taskTypes = {
  'drawing': DrawingTask,
  'multiple': QuestionTask,  // Shared with single answer question task
  'single': QuestionTask,
  'text': TextTask
}

function EditTaskForm({  // It's not actually a form, but a fieldset that's part of a form.
  deleteTask,
  enforceLimitedBranchingRule,
  showDeleteButton = false,
  task,
  taskKey,
  updateTask
}) {
  const TaskForm = taskTypes[task?.type] || UnknownTask
  
  return (
    <fieldset
      className="edit-task-form"
    >
      <legend className="task-key">{taskKey}</legend>
      <TaskForm
        deleteTask={deleteTask}
        enforceLimitedBranchingRule={enforceLimitedBranchingRule}
        showDeleteButton={showDeleteButton}
        task={task}
        taskKey={taskKey}
        updateTask={updateTask}
      />
    </fieldset>
  )
}

EditTaskForm.propTypes = {
  deleteTask: PropTypes.func,
  enforceLimitedBranchingRule: PropTypes.shape({
    stepHasBranch: PropTypes.bool
  }),
  showDeleteButton: PropTypes.bool,
  task: PropTypes.object,
  taskKey: PropTypes.string,
  updateTask: PropTypes.func
}              

export default EditTaskForm