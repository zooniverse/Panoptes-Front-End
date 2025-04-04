import { useState } from 'react'
import PropTypes from 'prop-types'

import TaskHeader from '../components/TaskHeader.jsx'
import TaskInstructionField from '../components/TaskInstructionField.jsx'
import TaskHelpField from '../components/TaskHelpField.jsx'

const DEFAULT_HANDLER = () => {}
const TEXT_TAGS = ['deletion', 'insertion', 'unclear']

function TextTask({
  deleteTask = DEFAULT_HANDLER,
  stepHasManyTasks = false,
  task,
  taskKey,
  updateTask = DEFAULT_HANDLER
}) {
  const [ help, setHelp ] = useState(task?.help || '')
  const [ instruction, setInstruction ] = useState(task?.instruction || '')
  const [ required, setRequired ] = useState(!!task?.required)
  const [ textTags, setTextTags ] = useState(Array.isArray(task?.text_tags) ? task.text_tags : [])
  const title = 'Text Task'

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
    const newTask = {
      ...task,
      help,
      instruction,
      required: optionalStateOverrides?.required ?? required,
      text_tags: optionalStateOverrides?.textTags ?? textTags
    }
    updateTask(taskKey, newTask)
  }

  function toggleRequired(e) {
    const val = !!e?.currentTarget?.checked
    setRequired(val)
    update({ required: val })
  }

  function toggleTextTag(e) {
    const textTag = e?.currentTarget?.dataset?.texttag
    if (!textTag) return

    let newTextTags = []
    if (textTags.includes(textTag)) {
      newTextTags = textTags.filter(t => t !== textTag)
    } else {
      newTextTags = textTags.slice().push(textTag).sort()
    }
    setTextTags(newTextTags)
    update({ textTags: newTextTags })
  }

  return (
    <div className="text-task">
      <TaskHeader
        task={task}
        taskKey={taskKey}
        title={title}
      >
        <p>The volunteer types into a free-text entry field. Can be combined with other tasks on a page.</p>
      </TaskHeader>

      <TaskInstructionField
        deleteTask={deleteTask}
        setValue={setInstruction}
        showDeleteButton={stepHasManyTasks}
        taskKey={taskKey}
        update={update}
        value={instruction}
      >
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
      </TaskInstructionField>

      <div className="task-field">
        <div className="task-field-subheader">
          <label className="small-label">
            Text Modifiers
          </label>
        </div>
        <div className="tags-array">
          {TEXT_TAGS.map(textTag => (
            <span
              className="task-field-checkbox-set"
              key={`task-${taskKey}-textTag-${textTag}`}
            >
              <input
                checked={textTags.includes(textTag)}
                data-texttag={textTag}
                id={`task-${taskKey}-textTag-${textTag}`}
                onChange={toggleTextTag}
                type="checkbox"
              />
              <label
                htmlFor={`task-${taskKey}-textTag-${textTag}`}
                style={{ textTransform: 'capitalize' }}
              >
                {textTag}
              </label>
            </span>
          ))}
        </div>
      </div>

      <TaskHelpField
        help={help}
        setHelp={setHelp}
        taskKey={taskKey}
        update={update}
      />
    </div>
  )
}

TextTask.propTypes = {
  deleteTask: PropTypes.func,
  stepHasManyTasks: PropTypes.bool,
  task: PropTypes.object,
  taskKey: PropTypes.string,
  updateTask: PropTypes.func
}

export default TextTask