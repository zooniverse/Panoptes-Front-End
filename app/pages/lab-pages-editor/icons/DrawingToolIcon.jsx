import PropTypes from 'prop-types';

export default function DrawingToolIcon({
  alt,
  className = 'icon',
  color = 'currentColor',
  size = 24,
  thickness = 5,
  type
}) {
  let icon;

  switch (type) {
    case 'circle':
      icon = (<ellipse rx='33' ry='33' cx='50' cy='50' />);
      break;
    case 'ellipse':
      icon = (<ellipse rx='45' ry='25' cx='50' cy='50' transform='rotate(-30, 50, 50)' />);
      break;
    case 'line':
      icon = (<line x1='25' y1='90' x2='75' y2='10' />);
      break;
    case 'point':
      icon = (<>
        <circle r='30' cx='50' cy='50' />
        <line x1='50' y1='5' x2='50' y2='40' />
        <line x1='95' y1='50' x2='60' y2='50' />
        <line x1='50' y1='95' x2='50' y2='60' />
        <line x1='5' y1='50' x2='40' y2='50' />
      </>);
      break;
    case 'polygon':
      icon = (<polyline points='50, 5 90, 90 50, 70 5, 90 50, 5' />);
      break;
    case 'rectangle':
      icon = (<rect x='10' y='30' width='80' height='40' />);
      break;
    case 'rotateRectangle':
      icon = (<rect x='10' y='30' width='80' height='40' />);
      break;
    default:
      icon = (<circle r='50' cx='50' cy='50' />);
      break;
  }

  return (
    <svg aria-label={alt} width={size} height={size} className={className} viewBox='0 0 100 100'>
      <g fill="none" stroke={color} strokeWidth={thickness}>
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
  thickness: PropTypes.number,
  type: PropTypes.string
};
