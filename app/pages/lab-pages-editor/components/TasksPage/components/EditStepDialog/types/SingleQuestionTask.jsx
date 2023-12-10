import { useEffect, useState } from 'react';

export default function SingleQuestionTask({
  task,
  taskKey,
  updateTask = () => {}
}) {
  const [ answers, setAnswers ] = useState(task?.answers || []);
  const [ help, setHelp ] = useState(task?.help || '');
  const [ question, setQuestion ] = useState(task?.question || '');  // TODO: figure out if FEM is standardising Question vs Instructions
  const [ required, setRequired ] = useState(!!task?.required);

  // Update is usually called manually onBlur, after user input is complete.
  function update() {
    const newTask = {
      ...task,
      answers,
      help,
      question,
      required
    };
    updateTask(taskKey, newTask);
  }

  function addChoice(e) {
    e.preventDefault();
    return false;
  }

  // For inputs that don't have onBlur, update triggers automagically.
  // (You can't call update() in the onChange() right after setStateValue().)
  useEffect(update, [required]);

  return (
    <div className="single-question-task">
      <div className="input-row">
        <label
          className="big"
          htmlFor={`task-${taskKey}-instruction`}
        >
          Main Text
        </label>
        <div className="flex-row">
          <span className="task-key">{taskKey}</span>
          <input
            className="flex-item"
            id={`task-${taskKey}-question`}
            type="text"
            value={question}
            onBlur={update}
            onChange={(e) => { setQuestion(e?.target?.value) }}
          />
        </div>
        {/* <button>Delete</button> */}
      </div>
      <div className="input-row">
        <label className="big">Choices</label>
        <div className="flex-row">
          <button
            aria-label="Add choice"
            class="big"
            onClick={addChoice}
            type="button"
          >
            +
          </button>
          <label className="narrow">
            <input
              type="checkbox"
              checked={required}
              onChange={(e) => {
                setRequired(!!e?.target?.checked);
              }}
            />
            <span>
              Required
            </span>
          </label>
        </div>
      </div>
      <div className="input-row">
        <ul>
          {answers.map(({ label, next }, index) => (
            <li>
              <input
                key={`single-question-task-answer-${index}`}
                type="text"
                value={label}
              />
            </li>
          ))}
        </ul>
      </div>
      <div className="input-row">
        <label
          className="big"
          htmlFor={`task-${taskKey}-help`}
        >
          Help Text
        </label>
        <textarea
          id={`task-${taskKey}-help`}
          value={help}
          onBlur={update}
          onChange={(e) => { setHelp(e?.target?.value) }}
        />
      </div>
    </div>
  );
}
