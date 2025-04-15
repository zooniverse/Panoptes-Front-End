import PropTypes from 'prop-types'

import taskIconForDrawing from './assets/task-drawing.svg'
import taskIconForQuestion from './assets/task-question.svg'
import taskIconForText from './assets/task-text.svg'
import taskIconForUndefined from './assets/task-undefined.svg'

function TaskIcon({
  alt,
  className = '',
  type,
  size = 'small'
}) {
  const isLarge = (size === 'large')
  const width =  isLarge ? 40 : 19
  const height = isLarge ? 40 : 19

  let iconSrc = taskIconForUndefined

  switch (type) {
    case 'drawing':
      iconSrc = taskIconForDrawing
      break
    
    case 'multiple':  // Multiple answer question
    case 'single':  // Single answer question
    iconSrc = taskIconForQuestion
      break
    
    case 'text':
      iconSrc = taskIconForText
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
