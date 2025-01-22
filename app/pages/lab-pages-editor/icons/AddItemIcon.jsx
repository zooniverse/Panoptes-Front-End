export default function AddItemIcon({ alt, className = '', width = 12, height = 12 }) {
  return (
    <svg
      className={`icon ${className}`}
      aria-label={alt}
      width={width}
      height={height}
      viewBox="0 0 12 12"
      fill="none"
    >
      <path
        d="M6 12V0M0 6H12"
        stroke="currentColor"
        stroke-width="2"
      />
    </svg>
  );
}
