import closeIcon from './assets/close-icon.png'

export default function CloseIcon({
  alt,
  className = '',
  width = 16,
  height = 16,
}) {
  return (
    <img
      alt={alt}
      className={`icon ${className}`}
      src={closeIcon}
      width={width}
      height={height}
    />
  );
}
