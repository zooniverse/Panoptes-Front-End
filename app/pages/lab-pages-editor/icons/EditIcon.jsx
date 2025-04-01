import editIcon from './assets/edit-icon.svg'

export default function EditIcon({
  alt,
  className = '',
  width,
  height,
}) {
  return (
    <img
      alt={alt}
      className={`icon ${className}`}
      src={editIcon}
      width={width}
      height={height}
    />
  )
}
