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
    const nonEmptyAnswers = answers.filter(({ label }) => label.trim().length > 0);

    const newTask = {
      ...task,
      answers: nonEmptyAnswers,
      help,
      question,
      required
    };
    updateTask(taskKey, newTask);
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

    const newAnswers = answers.slice()
    newAnswers.splice(index, 1);
    setAnswers(newAnswers);

    // TODO: UPDATE!
    // update(newAnswers)

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
            className="big"
            onClick={addAnswer}
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
            <li
              aria-label={`Choice ${index}`}
              className="flex-row"
              key={`single-question-task-answer-${index}`}
            >
              <input
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
                data-index={index}
              >
                x
              </button>
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
