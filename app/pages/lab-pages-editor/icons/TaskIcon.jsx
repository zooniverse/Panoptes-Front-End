import PropTypes from 'prop-types'

import smallTaskIconForDrawing from './assets/task-19x19-drawing.png'
import smallTaskIconForQuestion from './assets/task-19x19-question.png'
import smallTaskIconForText from './assets/task-19x19-text.png'
import smallTaskIconForUndefined from './assets/task-19x19-undefined.png'

// TMP
const largeTaskIconForDrawing = smallTaskIconForDrawing
const largeTaskIconForQuestion = smallTaskIconForQuestion
const largeTaskIconForText = smallTaskIconForText
const largeTaskIconForUndefined = smallTaskIconForUndefined

function TaskIcon({
  alt,
  className = '',
  type,
  size = 'small'
}) {
  const isLarge = (size === 'large')
  const width =  isLarge ? 40 : 19
  const height = isLarge ? 40 : 19

  let iconSrc = isLarge ? largeTaskIconForUndefined : smallTaskIconForUndefined

  switch (type) {
    case 'drawing':
      iconSrc = isLarge ? largeTaskIconForDrawing : smallTaskIconForDrawing
      break
    
    case 'multiple':  // Multiple answer question
    case 'single':  // Single answer question
    iconSrc = isLarge ? largeTaskIconForQuestion : smallTaskIconForQuestion
      break
    
    case 'text':
      iconSrc = isLarge ? largeTaskIconForText : smallTaskIconForText
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
