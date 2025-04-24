import { useState } from 'react'
import PropTypes from 'prop-types'

import DeleteIcon from '../../../../../icons/DeleteIcon.jsx'
import AddItemIcon from '../../../../../icons/AddItemIcon.jsx'

import TaskHeader from '../components/TaskHeader.jsx'
import TaskInstructionField from '../components/TaskInstructionField.jsx'
import TaskHelpField from '../components/TaskHelpField.jsx'

const DEFAULT_HANDLER = () => {}

function QuestionTask({
  deleteTask = DEFAULT_HANDLER,
  isSubTask = false,
  enforceLimitedBranchingRule,
  stepHasManyTasks = false,
  task,
  taskKey,
  updateTask = DEFAULT_HANDLER
}) {
  const [ answers, setAnswers ] = useState(task?.answers || [])
  const [ help, setHelp ] = useState(task?.help || '')
  const [ question, setQuestion ] = useState(task?.question || '')  // TODO: figure out if FEM is standardising Question vs Instructions
  const [ required, setRequired ] = useState(!!task?.required)
  const [ isMultiple, setIsMultiple ] = useState(task?.type === 'multiple')
  const title = 'Question Task'

  // update() gets the latest Task data and prepares for all the changes to be
  // committed. There are two ways the latest Task data is update()-ed:
  // 1. for data fields with onBlur (e.g. "Instructions" text input), we can
  //    pull the values from the React state. (i.e. the useState() value)
  // 2. for everything else (e.g. "is Required" checkbox), the
  //    optionalStateOverrides must be set for that data field 
  //    (e.g. optionalStateOverrides = { required: true })
  // This is because React state changes only really register _before_ onBlur,
  // but _after_ onChange.
  // Not to be confused with updateTask(), which actually performs the commit,
  // and which update() calls.
  function update(optionalStateOverrides) {
    const _answers = optionalStateOverrides?.answers || answers
    const nonEmptyAnswers = _answers.filter(({ label }) => label.trim().length > 0)

    const newTask = {
      ...task,
      type: (optionalStateOverrides?.isMultiple ?? isMultiple) ? 'multiple' : 'single',
      answers: nonEmptyAnswers,
      help,
      question,
      required: optionalStateOverrides?.required ?? required
    }
    updateTask(taskKey, newTask)
  }

  function toggleRequired(e) {
    const val = !!e?.currentTarget?.checked
    setRequired(val)
    update({ required: val })
  }

  function toggleIsMultiple(e) {
    const val = !!e?.currentTarget?.checked
    setIsMultiple(val)
    update({ isMultiple: val })
  }

  function addAnswer(e) {
    const newAnswers = [ ...answers, { label: '', next: undefined }]
    setAnswers(newAnswers)

    e.preventDefault()
    return false
  }

  function editAnswer(e) {
    const index = e?.currentTarget?.dataset?.index
    if (index === undefined || index < 0 || index >= answers.length) return

    const answer = answers[index]
    const newLabel = e?.currentTarget?.value || ''

    setAnswers(answers.with(index, { ...answer, label: newLabel }))
  }

  function deleteAnswer(e) {
    const index = e?.currentTarget?.dataset?.index
    if (index === undefined || index < 0 || index >= answers.length) return

    const newAnswers = answers.slice()  // Copy answers
    newAnswers.splice(index, 1)
    setAnswers(newAnswers)
    update({ answers: newAnswers })  // Use optional state override, since setAnswers() won't reflect new values in this step of the lifecycle.
    
    e.preventDefault()
    return false
  }

  return (
    <div className="question-task task">
      {(!isSubTask) && (
        <TaskHeader
          task={task}
          taskKey={taskKey}
          title={title}
        >
          <p>
            Single choice (default):<br/>
            The volunteer reads a question and selects one response from a list of choices. Cannot be combined with other tasks on a page.
          </p>
          <p>To allow volunteers to select multiple responses, check the ‘Allow multiple’ option in the task editor. When selected, the question task can be combined with other tasks on a page. </p>
        </TaskHeader>
      )}

      <TaskInstructionField
        deleteTask={deleteTask}
        isSubTask={isSubTask}
        setValue={setQuestion}
        showDeleteButton={stepHasManyTasks}
        taskKey={taskKey}
        update={update}
        value={question}
      />
      
      <div className="task-field">
        <div className="task-field-subheader">
          <label className="big-label">Choices</label>
          <span className="spacer" />
          <span className="task-field-checkbox-set">
            <input
              id={`task-${taskKey}-required`}
              type="checkbox"
              checked={required}
              onChange={toggleRequired}
            />
            <label htmlFor={`task-${taskKey}-required`}>
              Required
            </label>
          </span>
          <span className="task-field-checkbox-set">
            <input
              id={`task-${taskKey}-multiple`}
              type="checkbox"
              checked={isMultiple}
              disabled={enforceLimitedBranchingRule?.stepHasBranch && isMultiple /* If rule is enforced, you can't switch a Multi Question Task to a Single Question Task. */}
              onChange={toggleIsMultiple}
            />
            <label htmlFor={`task-${taskKey}-multiple`}>
              Allow multiple
            </label>
          </span>
        </div>
      
        <ul>
          {answers.map(({ label, next }, index) => (
            <li
              className="flex-row"
              key={`question-task-answer-${index}`}
            >
              <input
                aria-label={`Choice ${index}`}
                className="flex-item"
                onChange={editAnswer}
                onBlur={update}
                type="text"
                value={label}
                data-index={index}
              />
              <button
                aria-label={`Delete choice ${index}`}
                onClick={deleteAnswer}
                className="delete-button"
                data-index={index}
                type="button"
              >
                <DeleteIcon data-index={index} />
              </button>
            </li>
          ))}
          <li className="decorated-prompt">
            <span className="decoration-line" />
            <button
              onClick={addAnswer}
              type="button"
            >
              Add a choice
              <AddItemIcon />
            </button>
            <span className="decoration-line" />
          </li>
        </ul>
      </div>

      {(!isSubTask) && (
        <TaskHelpField
          help={help}
          setHelp={setHelp}
          taskKey={taskKey}
          update={update}
        />
      )}
    </div>
  )
}

QuestionTask.propTypes = {
  deleteTask: PropTypes.func,
  isSubTask: PropTypes.bool,
  enforceLimitedBranchingRule: PropTypes.shape({
    stepHasBranch: PropTypes.bool
  }),
  stepHasManyTasks: PropTypes.bool,
  task: PropTypes.object,
  taskKey: PropTypes.string,
  updateTask: PropTypes.func
}

export default QuestionTask
