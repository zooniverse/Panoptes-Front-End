export default function BranchingControls({ task, allSteps }) {
  if (!task) return null;

  const answers = task.answers || []
  console.log('+++ task ', task)

  return (
    <ul className="branching-controls">
      {answers.map((answer, index) => (
        <li key={`branching-controls-answer-${index}`}>
          <div>{answer.label}</div>
          <select>
            <option>P0</option>
            <option>P1</option>
            <option>P2</option>
          </select>
        </li>
      ))}

    </ul>
  );
}
