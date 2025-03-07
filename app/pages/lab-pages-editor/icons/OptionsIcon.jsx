import optionsIcon from './images/options-icon.png'

export default function OptionsIcon({
  alt,
  className = '',
  width = 22,
  height = 8,
}) {
  return (
    <img
      alt={alt}
      className={`icon ${className}`}
      src={optionsIcon}
      width={width}
      height={height}
    />
  );
}
