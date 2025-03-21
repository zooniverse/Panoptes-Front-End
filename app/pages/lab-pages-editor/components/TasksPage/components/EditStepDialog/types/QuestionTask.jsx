import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import DeleteIcon from '../../../../../icons/DeleteIcon.jsx';
import MinusIcon from '../../../../../icons/MinusIcon.jsx';
import PlusIcon from '../../../../../icons/PlusIcon.jsx';
import TaskHelpField from '../TaskHelpField.jsx'

const DEFAULT_HANDLER = () => {};

function QuestionTask({
  deleteTask = DEFAULT_HANDLER,
  enforceLimitedBranchingRule,
  isFirstTaskInStep = true,
  stepHasManyTasks = false,
  task,
  taskKey,
  updateTask = DEFAULT_HANDLER
}) {
  const [ answers, setAnswers ] = useState(task?.answers || []);
  const [ help, setHelp ] = useState(task?.help || '');
  const [ question, setQuestion ] = useState(task?.question || '');  // TODO: figure out if FEM is standardising Question vs Instructions
  const [ required, setRequired ] = useState(!!task?.required);
  const [ isMultiple, setIsMultiple ] = useState(task?.type === 'multiple');
  const title = stepHasManyTasks ? 'Question Task' : 'Main Text';

  // Update is usually called manually onBlur, after user input is complete.
  function update(optionalStateOverrides) {
    const _answers = optionalStateOverrides?.answers || answers
    const nonEmptyAnswers = _answers.filter(({ label }) => label.trim().length > 0);

    const newTask = {
      ...task,
      type: (!isMultiple) ? 'single' : 'multiple',
      answers: nonEmptyAnswers,
      help,
      question,
      required
    };
    updateTask(taskKey, newTask);
  }

  function doDelete() {
    deleteTask(taskKey);
  }

  function addAnswer(e) {
    const newAnswers = [ ...answers, { label: '', next: undefined }];
    setAnswers(newAnswers);

    e.preventDefault();
    return false;
  }

  function editAnswer(e) {
    const index = e?.target?.dataset?.index;
    if (index === undefined || index < 0 || index >= answers.length) return;

    const answer = answers[index];
    const newLabel = e?.target?.value || '';

    setAnswers(answers.with(index, { ...answer, label: newLabel }));
  }

  function deleteAnswer(e) {
    const index = e?.target?.dataset?.index;
    if (index === undefined || index < 0 || index >= answers.length) return;

    const newAnswers = answers.slice();  // Copy answers
    newAnswers.splice(index, 1);
    setAnswers(newAnswers);
    update({ answers: newAnswers });  // Use optional state override, since setAnswers() won't reflect new values in this step of the lifecycle.
    
    e.preventDefault();
    return false;
  }

  const [ showHelpField, setShowHelpField ] = useState(isFirstTaskInStep || task?.help?.length > 0);
  function toggleShowHelpField() {
    setShowHelpField(!showHelpField);
  }

  // For inputs that don't have onBlur, update triggers automagically.
  // (You can't call update() in the onChange() right after setStateValue().)
  // TODO: useEffect() means update() is called on the first render, which is unnecessary. Clean this up.
  useEffect(update, [required, isMultiple]);

  return (
    <div className="question-task">
      <div className="field-block">
        <label
          className="big spacing-bottom-S"
          htmlFor={`task-${taskKey}-instruction`}
        >
          {title}
        </label>
        <div className="flex-row">
          <span className="task-key">{taskKey}</span>
          <input
            className="flex-item"
            id={`task-${taskKey}-instruction`}
            type="text"
            value={question}
            onBlur={update}
            onChange={(e) => { setQuestion(e?.target?.value) }}
          />
          <button
            aria-label={`Delete Task ${taskKey}`}
            className="big"
            onClick={doDelete}
            type="button"
          >
            <DeleteIcon />
          </button>
        </div>
      </div>
      <div className="field-block">
        <span className="big spacing-bottom-S">Choices</span>
        <div className="flex-row">
          <button
            aria-label="Add choice"
            className="big"
            onClick={addAnswer}
            type="button"
          >
            <PlusIcon />
          </button>
          <span className="narrow">
            <input
              id={`task-${taskKey}-required`}
              type="checkbox"
              checked={required}
              onChange={(e) => {
                setRequired(!!e?.target?.checked);
              }}
            />
            <label htmlFor={`task-${taskKey}-required`}>
              Required
            </label>
          </span>
          <span className="narrow">
            <input
              id={`task-${taskKey}-multiple`}
              type="checkbox"
              checked={isMultiple}
              disabled={enforceLimitedBranchingRule?.stepHasBranch && isMultiple /* If rule is enforced, you can't switch a Multi Question Task to a Single Question Task. */}
              onChange={(e) => {
                setIsMultiple(!!e?.target?.checked);
              }}
            />
            <label htmlFor={`task-${taskKey}-multiple`}>
              Allow multiple
            </label>
          </span>
        </div>
      </div>
      <div className="field-block">
        <ul>
          {answers.map(({ label, next }, index) => (
            <li
              className="flex-row"
              key={`question-task-answer-${index}`}
            >
              <input
                aria-label={`Choice ${index}`}
                className="flex-item"
                onChange={editAnswer}
                onBlur={update}
                type="text"
                value={label}
                data-index={index}
              />
              <button
                aria-label={`Delete choice ${index}`}
                onClick={deleteAnswer}
                className="big"
                data-index={index}
                type="button"
              >
                <MinusIcon data-index={index} />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <TaskHelpField
        help={help}
        setHelp={setHelp}
        showHelpField={showHelpField}
        taskKey={taskKey}
        toggleShowHelpField={toggleShowHelpField}
        update={update}
      />
    </div>
  );
}

QuestionTask.propTypes = {
  deleteTask: PropTypes.func,
  enforceLimitedBranchingRule: PropTypes.shape({
    stepHasBranch: PropTypes.bool
  }),
  isFirstTaskInStep: PropTypes.bool,
  stepHasManyTasks: PropTypes.bool,
  task: PropTypes.object,
  taskKey: PropTypes.string,
  updateTask: PropTypes.func
};

export default QuestionTask;