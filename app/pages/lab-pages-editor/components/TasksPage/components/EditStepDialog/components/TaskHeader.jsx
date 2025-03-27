import { useState } from 'react'
import PropTypes from 'prop-types'

import CollapseIcon from '../../../../../icons/CollapseIcon.jsx'
import ExpandIcon from '../../../../../icons/ExpandIcon.jsx'
import TaskIcon from '../../../../../icons/TaskIcon.jsx'

function TaskHeader({
  children,
  task,
  taskKey,
  title,
}) {
  const [ showInfoPanel, setShowInfoPanel ] = useState(false)
  function toggleShowInfoPanel() {
    setShowInfoPanel(!showInfoPanel)
  }

  return (
    <>
      <div className="task-header">
        <TaskIcon type={task.type} />
        <h5>{title}</h5>
        <span className="task-key">{taskKey}</span>
        <span className="spacer" />
        <button
          className="info-button"
          onClick={toggleShowInfoPanel}
        >
          See more {showInfoPanel? <CollapseIcon /> : <ExpandIcon />}
        </button>
      </div>

      <div
        className="info-panel"
        hidden={!showInfoPanel}
      >
        {children}
      </div>
    </>
  )
}

TaskHeader.propTypes = {
  task: PropTypes.object,
  taskKey: PropTypes.string,
  title: PropTypes.string,
}

export default TaskHeader