export default function NextStepIcon({ alt, className = '', width = 30, height = 30 }) {
  return (
    <svg
      className={`icon ${className}`}
      aria-label={alt}
      width={width}
      height={height}
      viewBox="0 0 30 30"
      fill="none"
    >
      <path
        d="M27 9L15 21L3 9"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
