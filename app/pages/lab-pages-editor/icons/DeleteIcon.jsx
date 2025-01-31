export default function DeleteIcon({ alt, className = '', width = 40, height = 40 }) {
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
        d="M14.2148 14.3077L14.974 25.8462C15.01 26.5129 15.5205 27 16.1885 27H23.1723C23.843 27 24.344 26.5129 24.3869 25.8462L25.146 14.3077"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 14.3077H26.3603"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
      <path
        d="M17.251 14.3077V12.8654C17.2507 12.7516 17.274 12.639 17.3197 12.5338C17.3653 12.4287 17.4324 12.3331 17.5171 12.2527C17.6017 12.1723 17.7023 12.1086 17.8129 12.0652C17.9236 12.0218 18.0422 11.9997 18.162 12H21.1984C21.3181 11.9997 21.4367 12.0218 21.5474 12.0652C21.6581 12.1086 21.7586 12.1723 21.8433 12.2527C21.9279 12.3331 21.995 12.4287 22.0407 12.5338C22.0863 12.639 22.1097 12.7516 22.1093 12.8654V14.3077M19.6802 16.6154V24.6923M16.9474 16.6154L17.251 24.6923M22.413 16.6154L22.1093 24.6923"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
