React = require 'react'

module.exports =
  anchoredEllipse: <svg viewBox="0 0 100 100">
    <ellipse className="shape" rx="45" ry="25" cx="50" cy="50" transform="rotate(-30, 50, 50)" />
    <circle className="shape" r="5" cy="50" cx="50"></circle>
  </svg>

  point: <svg viewBox="0 0 100 100">
    <circle className="shape" r="30" cx="50" cy="50" />
    <line className="shape" x1="50" y1="5" x2="50" y2="40" />
    <line className="shape" x1="95" y1="50" x2="60" y2="50" />
    <line className="shape" x1="50" y1="95" x2="50" y2="60" />
    <line className="shape" x1="5" y1="50" x2="40" y2="50" />
  </svg>

  pointGrid: <svg viewBox="0 0 100 100">
    <line className="shape" x1="20" y1="0" x2="20" y2="80" />
    <line className="shape" x1="40" y1="0" x2="40" y2="80" />
    <line className="shape" x1="60" y1="0" x2="60" y2="80" />

    <line className="shape" x1="0" y1="20" x2="80" y2="20" />
    <line className="shape" x1="0" y1="40" x2="80" y2="40" />
    <line className="shape" x1="0" y1="60" x2="80" y2="60" />
  </svg>

  line: <svg viewBox="0 0 100 100">
    <line className="shape" x1="25" y1="90" x2="75" y2="10" />
  </svg>

  rectangle: <svg viewBox="0 0 100 100">
    <rect className="shape" x="10" y="30" width="80" height="40" />
  </svg>

  rotateRectangle: <svg viewBox="0 0 100 100">
    <rect className="shape" x="10" y="30" width="80" height="40" />
  </svg>

  polygon: <svg viewBox="0 0 100 100">
    <polyline className="shape" points="50, 5 90, 90 50, 70 5, 90 50, 5" />
  </svg>

  circle: <svg viewBox="0 0 100 100">
    <ellipse className="shape" rx="33" ry="33" cx="50" cy="50" />
  </svg>

  ellipse: <svg viewBox="0 0 100 100">
    <ellipse className="shape" rx="45" ry="25" cx="50" cy="50" transform="rotate(-30, 50, 50)" />
  </svg>

  bezier: <svg viewBox="0 0 100 100">
    <path d="M90 90 Q 10 50 90 10" fill={'none'} />
    <path d="M90 90 L 10 50 L 90 10" strokeDasharray={[10, 10]} fill={'none'} />
  </svg>

  column: <svg viewBox="0 0 100 100">
    <rect className="shape" x="10" y="0" width="25" height="100%" />
  </svg>

  grid: <svg viewBox="0 0 100 100">
    <polyline className="shape" points="0, 25 50, 25 50, 75 0, 75 0, 25 50, 25 100, 25 100, 75 50, 75 50, 25" />
  </svg>

  triangle: <svg viewBox="0 0 100 100">
    <polygon className="shape" points="50, 12 95, 90 5,90 "/>
    <ellipse className="shape" cx="50" cy="64" rx="17" ry="9"/>
  </svg>

  freehandLine: <svg viewBox="0 0 100 100">
    <path d="M10,50 Q25,10,50,50,75,90,90,50" fill={'none'} />
  </svg>

  freehandShape: <svg viewBox="0 0 100 100">
    <path d="M20,60 C10,10,80,10,50,50 C20,90 90,90 80,40 z" />
  </svg>

  freehandSegmentLine: <svg viewBox="0 0 100 100">
    <path d="M10,50 Q25,10,50,50,75,90,90,50" fill={'none'} />
  </svg>

  freehandSegmentShape: <svg viewBox="0 0 100 100">
    <path d="M20,60 C10,10,80,10,50,50 C20,90 90,90 80,40 z" />
  </svg>

  fullWidthLine: <svg viewBox="0 0 100 100">
    <rect className="shape" x="0" y="0" width="100%" height="100%" strokeDasharray={[10, 10]} />
    <line className="shape" x1="0" y1="50" x2="100" y2="50" />
  </svg>

  fullHeightLine: <svg viewBox="0 0 100 100">
    <rect className="shape" x="0" y="0" width="100%" height="100%" strokeDasharray={[10, 10]} />
    <line className="shape" x1="50" y1="0" x2="50" y2="100" />
  </svg>

  fan: <svg viewBox="0 0 100 100">
    <path d="M 50 95 L 80 33 A 20 20 0 1 0 20 33 Z" />
  </svg>
