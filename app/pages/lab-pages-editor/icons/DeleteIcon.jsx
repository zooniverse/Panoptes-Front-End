import deleteIcon from './assets/delete-icon.svg'

export default function DeleteIcon({
  alt,
  className = '',
  width,
  height,
}) {
  return (
    <img
      alt={alt}
      className={`icon ${className}`}
      src={deleteIcon}
      width={width}
      height={height}
    />
  )
}
