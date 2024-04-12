import PropTypes from 'prop-types';

const faTaskIcons = {
  'drawing': 'fa-pencil',
  'multiple': 'fa-question-circle',  // Multiple answer question
  'single': 'fa-question-circle',  // Single answer question
  'text': 'fa-file-text-o'
};

function TaskIcon({
  alt,
  type
}) {
  const faTaskIcon = faTaskIcons[type] || 'fa-times-circle';

  return (
    <span
      className={`fa fa-fw ${faTaskIcon}`}
      aria-label={alt}
      role={!!alt ? 'img' : undefined}
    />
  );
}

TaskIcon.propTypes = {
  type: PropTypes.string
};

export default TaskIcon;
