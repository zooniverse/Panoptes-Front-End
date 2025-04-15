import copyIcon from './assets/copy-icon.svg'

export default function CopyIcon({
  alt,
  className = '',
  width,
  height,
}) {
  return (
    <img
      alt={alt}
      className={`icon ${className}`}
      src={copyIcon}
      width={width}
      height={height}
    />
  )
}
