export default function BranchingControls({
  allSteps = [],
  task,
  taskKey
}) {
  if (!task || !taskKey) return null;

  const answers = task.answers || []
  console.log('+++ task ', task)

  function onChange(e) {
    console.log('+++ onChange: ', e?.target?.value, e?.target?.dataset.index);
  }

  return (
    <ul className="branching-controls">
      {answers.map((answer, index) => (
        <li key={`branching-controls-answer-${index}`}>
          <div className="not-button">{answer.label}</div>
          <select
            data-index={index}
            onChange={onChange}
            value={answer?.next || ''}
          >
            <option
              value={''}
            >
              SUBMIT
            </option>
            {allSteps.map(([stepKey, stepBody]) => {
              const taskKeys = stepBody?.taskKeys?.toString() || '(none)';
              return (
                <option
                  key={`branching-controls-answer-${index}-option-${stepKey}`}
                  value={stepKey}
                >
                  {taskKeys}
                </option>
              );
            })}
          </select>
        </li>
      ))}
    </ul>
  );
}
