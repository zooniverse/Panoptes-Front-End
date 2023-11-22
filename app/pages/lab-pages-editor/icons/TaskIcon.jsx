/* eslint-disable react/react-in-jsx-scope */

import PropTypes from 'prop-types';

const faTaskIcons = {
  'drawing': 'fa-pencil',
  'single': 'fa-question-circle',  // Single question
  'text': 'fa-file-text-o'
};

function TaskIcon({
  alt,
  type
}) {
  const faTaskIcon = faTaskIcons[type] || 'fa-times-circle';

  return (
    <span
      aria-label="Task type: text"
      className={`fa fa-fw ${faTaskIcon}`}
      role="img"
    />
  );
}

TaskIcon.propTypes = {
  type: PropTypes.string
};

export default TaskIcon;
