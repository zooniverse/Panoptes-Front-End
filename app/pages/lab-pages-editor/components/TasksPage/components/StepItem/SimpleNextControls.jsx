import NextStepArrow from './NextStepArrow.jsx';

export default function SimpleNextControls({
  step
}) {
  if (!step) return null;
  const [ stepId, stepBody ] = step;

  return (
    <div className="next-step-controls simple-next-controls">
      <NextStepArrow className="next-arrow" />
      <div>NEXT: {stepBody?.next}</div>
    </div>
  );
}