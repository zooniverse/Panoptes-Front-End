export default function SimpleNextControls({
  step
}) {
  if (!step) return null;
  const [ stepId, stepBody ] = step;

  return (
    <div>
      NEXT: {stepBody?.next}
    </div>
  );
}