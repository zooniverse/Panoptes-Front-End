import PropTypes from 'prop-types'

import TaskHeader from '../components/TaskHeader.jsx'
import TaskInstructionField from '../components/TaskInstructionField.jsx'

const DEFAULT_HANDLER = () => {}

function UnknownTask({
  deleteTask = DEFAULT_HANDLER,
  isSubTask = false,
  task,
  taskKey
}) {
  const title = 'Unknown Task'
  let shortError = 'ERROR'
  let longError = 'ERROR'

  // Alright, what went wrong?
  if (!taskKey) {
    shortError = `ERROR: somehow, this task doesn't have a corresponding key.`
    longError = `ERROR: somehow, this task doesn't have a corresponding key. This isn't a user error - something must have gone very, very wrong in the code.`
  } else if (!task) {
    shortError = `ERROR: the task ${taskKey} doesn't seem to exist in the Workflow.`
    longError = `ERROR: the task ${taskKey} doesn't seem to exist in the Workflow. This could happen if a Workflow resource was manually edited (e.g. via CLI), such that workflow.steps[X] contains task Y, but workflow.tasks doesn't have the corresponding task Y.`
  } else {
    shortError = `ERROR: the task type "${task?.type}" might not be supported.`
    longError = `ERROR: the task type "${task?.type}" might not be supported. This new editor doesn't work with all previously supported Task types, particularly experimental one-off Tasks. Alternatively, if the Workflow resource was manually edited (e.g. via CLI), the type might have been misspelled.`
  }

  return (
    <div className="text-task">
      {(!isSubTask) && (
        <TaskHeader
          task={task}
          taskKey={taskKey}
          title={title}
        >
          <p>{longError}</p>
          <p>Please contact the Zooniverse team to see if they can help fix the issue.</p>
        </TaskHeader>
      )}

      <TaskInstructionField
        deleteTask={deleteTask}
        showDeleteButton={true}
        taskKey={taskKey}
        value={shortError}
      />
    </div>
  )
}

UnknownTask.propTypes = {
  deleteTask: PropTypes.func,
  isSubTask: PropTypes.bool,
  task: PropTypes.object,
  taskKey: PropTypes.string,
}

export default UnknownTask