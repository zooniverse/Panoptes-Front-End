import PropTypes from 'prop-types'

import drawingTaskSvg from './images/drawing-task.png'
import questionTaskSvg from './images/question-task.png'
import textTaskSvg from './images/text-task.png'
import undefinedTaskSvg from './images/undefined-task.png'

function TaskIcon({
  alt,
  className = '',
  type,
  width = 19,
  height = 19,
}) {
  let iconSrc = undefinedTaskSvg

  switch (type) {
    case 'drawing':
      iconSrc = drawingTaskSvg
      break
    
    case 'multiple':  // Multiple answer question
    case 'single':  // Single answer question
      iconSrc = questionTaskSvg
      break
    
    case 'text':
      iconSrc = textTaskSvg
      break
  }

  return (
    <img
      alt={alt}
      className={`icon ${className}`}
      src={iconSrc}
      width={width}
      height={height}
    />
  )
}

TaskIcon.propTypes = {
  alt: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
}

export default TaskIcon
