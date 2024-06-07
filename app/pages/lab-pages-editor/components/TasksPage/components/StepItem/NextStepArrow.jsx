export default function NextStepArrow({
  alt,
  arrowhead = false,
  className = 'icon',
  color = 'currentColor',
  height = 32,
  pad = 0,
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
        {arrowhead && <line x1={xA} y1={yB} x2={xB} y2={yC} />}
        {arrowhead && <line x1={xC} y1={yB} x2={xB} y2={yC} />}
      </g>
    </svg>
  );
}