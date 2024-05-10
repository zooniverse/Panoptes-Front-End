import PropTypes from 'prop-types';

export default function DrawingToolIcon({
  alt,
  className = 'icon',
  color = 'currentColor',
  size = 16,
  type
}) {
  let icon;

  switch (type) {

    default:
      icon = (
        <circle r={size / 2} cx={size / 2} cy={size / 2} />
      );
      break;
  }

  return (
    <svg aria-label={alt} width={size} height={size} className={className}>
      <g fill={color}>
        {icon}
      </g>
    </svg>
  );
}

DrawingToolIcon.propTypes = {
  alt: PropTypes.string,
  className: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.number,
  type: PropTypes.string
};
