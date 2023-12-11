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
