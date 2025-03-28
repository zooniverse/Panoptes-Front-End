import { useState } from 'react'
import PropTypes from 'prop-types'

import CollapseIcon from '../../../../../icons/CollapseIcon.jsx';
import ExpandIcon from '../../../../../icons/ExpandIcon.jsx';

const DEFAULT_HANDLER = () => {}

function TaskHelpField ({
  help = '',  // Help text written by user
  setHelp = DEFAULT_HANDLER,
  taskKey = '',
  update = DEFAULT_HANDLER,  // Update the workflow resource
}) {

  // Help field is collapsed by default, unless there's already content in it.
  const [ showHelpField, setShowHelpField ] = useState(help?.length > 0)
  function toggleShowHelpField() {
    setShowHelpField(!showHelpField)
  }

  return (
    <div className="task-field">
      <div className="task-field-subheader">
        <label
          className="small-label"
          htmlFor={`task-${taskKey}-help`}
          onClick={toggleShowHelpField}
        >
          Help Text
        </label>
        <button
          aria-label={showHelpField ? 'Hide Help field' : 'Show Help field'}
          aria-controls={`task-${taskKey}-help`}
          aria-expanded={showHelpField ? 'true' : 'false'}
          className="plain"
          onClick={toggleShowHelpField}
          type="button"
        >
          {showHelpField
            ? <CollapseIcon />
            : <ExpandIcon />
          }
        </button>
      </div>
      <textarea
        id={`task-${taskKey}-help`}
        hidden={!showHelpField}
        value={help}
        onBlur={update}
        onChange={(e) => { setHelp(e?.target?.value) }}
      />
    </div>
  )
}

TaskHelpField.propTypes = {
  help: PropTypes.string,
  setHelp: PropTypes.func,
  taskKey: PropTypes.string,
  update: PropTypes.func
}

export default TaskHelpField
