import optionsIcon from './assets/options-icon.svg'

export default function OptionsIcon({
  alt,
  className = '',
  width,
  height,
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
