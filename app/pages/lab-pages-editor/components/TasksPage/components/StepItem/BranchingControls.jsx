export default function BranchingControls({
  allSteps = [],
  task,
  taskKey,
  updateAnswerNext = () => {}
}) {
  if (!task || !taskKey) return null;

  const answers = task.answers || []

  function onChange(e) {
    const next = e.target?.value;
    const index = e?.target?.dataset.index;
    updateAnswerNext(taskKey, index, next);
  }

  return (
    <ul className="branching-controls">
      {answers.map((answer, index) => (
        <li key={`branching-controls-answer-${index}`}>
          <div className="fake-button">{answer.label}</div>
          <NextStepArrow className="next-arrow" />
          <select
            className={(!answer?.next) ? 'next-is-submit' : ''}
            data-index={index}
            onChange={onChange}
            value={answer?.next || ''}
          >
            <option
              value={''}
            >
              Submit
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

function NextStepArrow({
  alt,
  className = 'icon',
  color = 'currentColor',
  height = 48,
  pad = 4,
  strokeWidth = 2,
  width = 16
}) {
  const xA = 0 + pad;
  const xB = width * 0.5;
  const xC = width - pad;
  const yA = 0 + pad;
  const yB = height - (width / 2);
  const yC = height - pad;

  return (
    <svg aria-label={alt} width={width} height={height} className={className}>
      <g stroke={color} strokeWidth={strokeWidth}>
        <line x1={xB} y1={yA} x2={xB} y2={yC} />
        <line x1={xA} y1={yB} x2={xB} y2={yC} />
        <line x1={xC} y1={yB} x2={xB} y2={yC} />
      </g>
    </svg>
  );
}