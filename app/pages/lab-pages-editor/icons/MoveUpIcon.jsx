export default function MoveUpIcon({ alt, className = '', width = 16, height = 16 }) {
  return (
    <svg
      className={`icon ${className}`}
      aria-label={alt}
      role="img"
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
    >
      <g clipPath="url(#clip0_1767_3606)">
        <path
          d="M13.9194 13C14.7579 13 15.2241 12.0301 14.7003 11.3753L8.78088 3.97609C8.38056 3.47568 7.61947 3.47568 7.21915 3.97609L1.29977 11.3753C0.775961 12.0301 1.24213 13 2.08064 13H13.9194Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </g>
      <defs>
        <clipPath id="clip0_1767_3606">
          <rect width="16" height="16" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}
