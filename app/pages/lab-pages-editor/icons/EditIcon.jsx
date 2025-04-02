export default function EditIcon({ alt, className = '', width = 40, height = 40 }) {
  return (
    <svg
      className={`icon ${className}`}
      aria-label={alt}
      role="img"
      width={width}
      height={height}
      viewBox="0 0 40 40"
      fill="none"
    >
      <path
        d="M21.8311 17.3333L22.6667 18.1689L14.5956 26.2222H13.7778V25.4044L21.8311 17.3333ZM25.0311 12C24.8089 12 24.5778 12.0889 24.4089 12.2578L22.7822 13.8844L26.1156 17.2178L27.7422 15.5911C28.0889 15.2444 28.0889 14.6667 27.7422 14.3378L25.6622 12.2578C25.4844 12.08 25.2622 12 25.0311 12ZM21.8311 14.8356L12 24.6667V28H15.3333L25.1644 18.1689L21.8311 14.8356Z"
        fill="currentColor"
      />
    </svg>
  );
}
