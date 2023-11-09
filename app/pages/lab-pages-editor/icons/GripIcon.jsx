/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/require-default-props */

import PropTypes from 'prop-types';

export default function GripIcon({
  className = 'icon',
  color = 'currentColor',
  size = 16
}) {
  const x1 = (4 / 16) * size;
  const x2 = (8 / 16) * size;
  const x3 = (12 / 16) * size;
  const y1 = (6 / 16) * size;
  const y2 = (10 / 16) * size;
  const r = (1.5 / 16) * size;

  return (
    <svg width={size} height={size} className={className}>
      <g fill={color}>
        <circle r={r} cx={x1} cy={y1} />
        <circle r={r} cx={x2} cy={y1} />
        <circle r={r} cx={x3} cy={y1} />
        <circle r={r} cx={x1} cy={y2} />
        <circle r={r} cx={x2} cy={y2} />
        <circle r={r} cx={x3} cy={y2} />
      </g>
    </svg>
  );
}

GripIcon.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.number
};
