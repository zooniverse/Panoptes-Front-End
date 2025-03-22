import CollapseIcon from '../../../../icons/CollapseIcon.jsx';
import ExpandIcon from '../../../../icons/ExpandIcon.jsx';

const DEFAULT_HANDLER = () => {}

export default function TaskHelpField ({
  help = '',  // Help text written by user
  setHelp = DEFAULT_HANDLER,
  showHelpField = false,
  taskKey = '',
  toggleShowHelpField = DEFAULT_HANDLER,
  update = DEFAULT_HANDLER,  // Update the workflow resource
}) {
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