import closeIcon from './assets/close-icon.svg'

export default function CloseIcon({
  alt,
  className = '',
  width,
  height,
}) {
  return (
    <img
      alt={alt}
      className={`icon ${className}`}
      src={closeIcon}
      width={width}
      height={height}
    />
  )
}
