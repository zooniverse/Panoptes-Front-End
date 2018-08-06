import PropTypes from 'prop-types';
import React from 'react';
import getSubjectLocation from '../lib/get-subject-location';

class SimplePoint {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class AxisLabel {
  constructor(annotation) {
    this.x = annotation.x;
    this.y = annotation.y;
    this.value = annotation.details[0].value;
  }
}

class AxisPoint {
  constructor(annotation) {
    this.x = annotation.x;
    this.y = annotation.y;
    this.value = annotation.details[0].value;
  }
}

class Axis {
  constructor(range, unit) {
    this.range = range;
    this.unit = unit;
  }
}
Axis.RA = 0;
Axis.RA1950 = 1;
Axis.DEC = 2;
Axis.DEC1950 = 3;
Axis.GLAT = 4;
Axis.GLON = 5;

class StarChart {
  constructor(annotation) {
    this.width = annotation.width;
    this.height = annotation.height;
    this.x = annotation.x;
    this.y = annotation.y;
    this.axisPoints = [];
    this.axisLabels = [];
    this.valid = false;
    this.GALACTIC = 0;
    this.EQUATORIAL = 1;
    this.OTHER = 2;

    const edges = [[this.x, this.y], [this.x, this.y + this.height], [this.x + this.width, this.y], [this.x + this.width, this.y + this.height]];
    this.corners = edges.map(pt =>
      new SimplePoint(pt[0], pt[1])
    );
  }

  bounds() {
    return {
      x: [this.x, this.x + this.width],
      y: [this.y, this.y + this.height]
    };
  }

  calculateDistance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)); // eslint-disable-line
  }

  closestCornerDistance(p) {
    const distance = this.corners.map(corner =>
      this.calculateDistance(p, corner)
    );
    return {
      chart: this,
      distance: (Math.min.apply(null, distance))
    };
  }

  calculateMidpoints() {
    this.midpoints = [];
    this.axisPoints.forEach((p1) => {
      this.axisPoints.forEach((p2) => {
        if (p1 !== p2) {
          this.midpoints.push({
            x: (p1.x + p2.x) / 2,
            y: (p1.y + p2.y) / 2,
            p1,
            p2
          });
        }
      });
    });
  }

  closestMidpointDistance(p) {
    if (!this.midpoints) {
      this.calculateMidpoints();
    }
    const distances = this.midpoints.map(midpoint =>
      this.calculateDistance(p, midpoint)
    );
    return {
      chart: this,
      distance: Math.min.apply(null, distances)
    };
  }

  addAxisPoint(axisPoint) {
    this.axisPoints.push(axisPoint);
  }

  addAxisLabel(axisLabel) {
    const otherUnitValue = 6;
    if (axisLabel.value === otherUnitValue) {
      this.removeIrrelevantPoints(axisLabel);
    } else {
      this.axisLabels.push(axisLabel);
    }
  }

  removeIrrelevantPoints(axisLabel) {
    let midpointDistance = Infinity;
    let pointsToRemove = [];
    this.midpoints.forEach((midpoint) => {
      const distanceFromLabel = this.calculateDistance(midpoint, axisLabel);
      if (distanceFromLabel < midpointDistance) {
        midpointDistance = distanceFromLabel;
        pointsToRemove = [midpoint.p1, midpoint.p2];
      }
    });
    pointsToRemove.map((point) => {
      const index = this.axisPoints.indexOf(point);
      this.axisPoints.splice(index, 1);
    });
  }

  findAxis(points) {
    let xSlope = Infinity;
    let ySlope = 0;
    let xAxis = null;
    let yAxis = null;
    points.forEach((pointA) => {
      points.forEach((pointB) => {
        if (Math.abs(this.slope(pointA, pointB)) < xSlope) {
          xSlope = Math.abs(this.slope(pointA, pointB));
          xAxis = [pointA, pointB];
        }
        if (Math.abs(this.slope(pointA, pointB)) > ySlope) {
          ySlope = Math.abs(this.slope(pointA, pointB));
          yAxis = [pointA, pointB];
        }
      });
    });
    return { xAxis, yAxis };
  }

  slope(pointA, pointB) {
    return (pointA.y - pointB.y) / (pointA.x - pointB.x);
  }

  findLabels(range, labels) {
    const midpoint = { x: (range[0].x + range[1].x) / 2, y: (range[1].y + range[1].y) / 2 };
    let label = null;
    let distance = Infinity;
    labels.forEach((point) => {
      if (this.calculateDistance(midpoint, point) < distance) {
        label = point;
        distance = this.calculateDistance(midpoint, point);
      }
    });
    return label;
  }

  buildAxes() {
    if (this.axisPoints.length >= 3 && this.axisLabels.length >= 2) {
      this.valid = true;
      const xRange = (this.findAxis(this.axisPoints)).xAxis.sort((a, b) => { return a.x > b.x; });
      const yRange = (this.findAxis(this.axisPoints)).yAxis.sort((a, b) => { return a.y > b.y; });
      const xLabel = this.findLabels(xRange, this.axisLabels);
      const yLabel = this.findLabels(yRange, this.axisLabels);
      this.xAxis = new Axis(xRange, xLabel.value);
      this.yAxis = new Axis(yRange, yLabel.value);
    }
  }

  coordinateSystem() {
    let coords = StarChart.OTHER;
    if ((this.xAxis.unit === Axis.RA && this.yAxis.unit === Axis.DEC) || (this.xAxis.unit === Axis.DEC && this.yAxis.unit === Axis.RA)) {
      coords = StarChart.EQUATORIAL;
    }
    if ((this.xAxis.unit === Axis.RA1950 && this.yAxis.unit === Axis.DEC1950) || (this.xAxis.unit === Axis.DEC1950 && this.yAxis.unit === Axis.RA1950)) {
      coords = StarChart.EQUATORIAL;
    }
    if ((this.xAxis.unit === Axis.GLAT && this.yAxis.unit === Axis.GLON) || (this.xAxis.unit === Axis.GLON && this.yAxis.unit === Axis.GLAT)) {
      coords = StarChart.GALACTIC;
    }
    return coords;
  }
}
StarChart.GALACTIC = 0;
StarChart.EQUATORIAL = 1;
StarChart.OTHER = 2;

class StarCoord {
  constructor(ra, dec) {
    this.ra = ra;
    this.dec = dec;
  }
}

StarCoord.fromRaDec = (xAxis, yAxis, xAxisDec, epoch1950) => {
  let ra;
  let dec;
  if (xAxisDec === true) {
    ra = yAxis;
    dec = xAxis;
  } else {
    ra = xAxis;
    dec = yAxis;
  }
  ra = StarCoord._parseDegrees(ra, false);
  dec = StarCoord._parseDegrees(dec, true);
  if (epoch1950) {
    [ra, dec] = StarCoord._epochConvert(ra, dec);
  }
  return new StarCoord(ra, dec);
};

StarCoord.fromGlatGlon = (xAxis, yAxis, xAxisGlat, epoch1950) => {
  const s = StarCoord;
  let glat;
  let glon;
  if (xAxisGlat === true) {
    glat = xAxis;
    glon = yAxis;
  } else {
    glon = xAxis;
    glat = yAxis;
    glat = glat.replace(/[^\d.-]/g, '');
    glon = glon.replace(/[^\d.-]/g, '');
  }
  const [b, l, pole_ra, pole_dec, posangle] = [s._toRadians(glat), s._toRadians(glon), s._toRadians(192.859508), s._toRadians(27.128336), s._toRadians(122.932 - 90.0)];
  const ra = s._toDegrees(Math.atan2((Math.cos(b) * Math.cos(l - posangle)), ((Math.sin(b) * Math.cos(pole_dec)) - (Math.cos(b) * Math.sin(pole_dec) * Math.sin(l - posangle)))) + pole_ra)
  const dec = s._toDegrees((Math.asin(Math.cos(b) * Math.cos(pole_dec) * Math.sin(l - posangle)) + (Math.sin(b) * Math.sin(pole_dec))))
  return new StarCoord(ra, dec);
};

StarCoord._epochConvert = (ra, dec) => {
  const newRA = ra / (180 / Math.PI);
  const newDEC = dec / (180 / Math.PI);

  const oldRaDec = StarCoord._transform(newRA, newDEC);
  const convertedRA = oldRaDec[0] * (180.0 / Math.PI);
  const convertedDEC = oldRaDec[1] * (180.0 / Math.PI);

  return [convertedRA, convertedDEC];
};

StarCoord._transform = (ra, dec) => {
  const r0 = [ Math.cos(ra) * Math.cos(dec), Math.sin(ra) * Math.cos(dec), Math.sin(dec) ];

  const matrix = [
   0.9999256782, -0.0111820611, -0.0048579477,
   0.0111820610,  0.9999374784, -0.0000271765,
   0.0048579479, -0.0000271474,  0.9999881997 ];

  const s0 = [
   r0[0]*matrix[0] + r0[1]*matrix[1] + r0[2]*matrix[2],
   r0[0]*matrix[3] + r0[1]*matrix[4] + r0[2]*matrix[5],
   r0[0]*matrix[6] + r0[1]*matrix[7] + r0[2]*matrix[8] ];

  const r = Math.sqrt( s0[0]*s0[0] + s0[1]*s0[1] + s0[2]*s0[2] );

  const result = [ 0.0, 0.0 ];
  result[1] = Math.asin( s0[2]/r );
  const cosaa = ( (s0[0]/r) / Math.cos(result[1] ) );
  const sinaa = ( (s0[1]/r) / Math.cos(result[1] ) );
  result[0] = Math.atan2(sinaa,cosaa);
  if ( result[0] < 0.0 ) result[0] = result[0] + Math.PI + Math.PI;
  return result;
}

StarCoord._toRadians = (degrees) => {
  return (degrees * Math.PI) / 180.0;
};

StarCoord._toDegrees = (radians) => {
  return (radians * 180.0) / Math.PI;
};

StarCoord._parseDegrees = (str, dec) => {
  if (!isNaN(str)) return parseFloat(str);
  const s = StarCoord;

  let isNeg = false;
  const reg = /(?:(-)?(\d+(?:\.\d+)?))(?:\D+(\d+(?:\.\d+)?))?(?:\D+(\d+(?:\.\d+)?))?/;

  const match = reg.exec(str);
  isNeg = match[1] === '-';
  match.shift();
  if (dec === true) {
    return s._decConvert(match, isNeg);
  } else {
    return s._raConvert(match, isNeg);
  }
};

StarCoord._raConvert = (match, isNeg) => {
  const multiplier = isNeg ? -1 : 1;

  return (parseInt(match[1], 10) * 15 +
  (parseInt(match[2], 10) / 4 || 0) +
  (parseInt(match[3], 10) / 240 || 0)) *
  multiplier;
};

StarCoord._decConvert = (match, isNeg) => {
  const multiplier = isNeg ? -1 : 1;

  return (parseInt(match[1], 10) +
  (parseInt(match[2], 10) / 60 || 0) +
  (parseInt(match[3], 10) / 3600 || 0)) *
  multiplier;
};

class Plate {
  constructor(starChart, url, subject) {
    let makeStarCoord;
    this.starChart = starChart;
    this.subject = subject;
    this.url = url;
    this.imageBounds = this.starChart.bounds();
    const [xRange, yRange] = [this.starChart.xAxis.range, this.starChart.yAxis.range];
    this.xyCorners = [
      new SimplePoint(xRange[0].x, yRange[0].y), new SimplePoint(xRange[1].x, yRange[0].y),
      new SimplePoint(xRange[1].x, yRange[1].y), new SimplePoint(xRange[0].x, yRange[1].y)
    ];

    if (this.starChart.coordinateSystem() === StarChart.EQUATORIAL) {
      makeStarCoord = StarCoord.fromRaDec;
    } else {
      makeStarCoord = StarCoord.fromGlatGlon;
    }
    const xAxisDec = (this.starChart.xAxis.unit === Axis.DEC || this.starChart.xAxis.unit === Axis.DEC1950 || this.starChart.xAxis.unit === Axis.GLAT);
    const epoch1950 = this.epochCheck();
    this.fullValues(xRange);
    this.fullValues(yRange);
    this.coordCorners = [
      makeStarCoord(xRange[0].value, yRange[0].value, xAxisDec, epoch1950), makeStarCoord(xRange[1].value, yRange[0].value, xAxisDec, epoch1950),
      makeStarCoord(xRange[1].value, yRange[1].value, xAxisDec, epoch1950), makeStarCoord(xRange[0].value, yRange[1].value, xAxisDec, epoch1950)
    ];
  }

  epochCheck() {
    if (this.subject.metadata.Publication_year < '2000') {
      return true;
    }
    return (this.starChart.xAxis.unit === Axis.DEC1950 || this.starChart.xAxis.unit === Axis.RA1950);
  }

  fullValues(ranges) {
    let difference;
    let secondValue;
    const firstValue = ranges[0].value.match(/(-)?\d+(?:\.\d+)?/g);
    if (ranges[1].value) {
      secondValue = ranges[1].value.match(/(-)?\d+(?:\.\d+)?/g);
    }
    if (secondValue.length) {
      difference = Math.abs(firstValue.length - secondValue.length);
    }
    if (difference > 0 && secondValue) {
      const longerNumber = (firstValue.length > secondValue.length) ? firstValue : secondValue;
      const shorterNumber = (secondValue.length < firstValue.length) ? secondValue : firstValue;
      let index = 0;
      do {
        shorterNumber.splice(index, 0, longerNumber[index]);
        index += 1;
      } while (longerNumber.length !== shorterNumber.length);
      [ranges[0].value, ranges[1].value] = [firstValue.join(' '), secondValue.join(' ')];
    }
    return null;
  }

  scale() {
    const [star1, star2] = [this.coordCorners[0], this.coordCorners[2]];
    const [xy1, xy2] = [this.xyCorners[0], this.xyCorners[2]];
    const averageDec = (star1.dec + star2.dec) / 2;
    const deltaRA = ((star2.ra - star1.ra) * Math.cos(averageDec * (Math.PI / 180))) * 3600;
    const deltaDec = (star2.dec - star1.dec) * 3600;
    const angularSep = Math.sqrt(Math.pow(deltaRA, 2) + Math.pow(deltaDec, 2)); // eslint-disable-line
    const pixelSep = Math.sqrt(Math.pow(xy1.x - xy2.x, 2) + Math.pow(xy1.y - xy2.y, 2)); // eslint-disable-line
    return angularSep / pixelSep;
  }

  centerCoords() {
    const s = this.starChart;
    const upperY = s.height - (s.yAxis.range[0].y - s.corners[0].y);
    const lowerY = s.corners[3].y - s.yAxis.range[1].y;
    return {
      x: ((s.xAxis.range[0].x - s.corners[0].x) + (s.xAxis.range[1].x - s.corners[0].x)) / 2,
      y: (upperY + lowerY) / 2,
      ra: (this.coordCorners[0].ra + this.coordCorners[2].ra) / 2,
      dec: (this.coordCorners[0].dec + this.coordCorners[2].dec) / 2
    };
  }

  getCropUrl() {
    const url = this.url.replace(/^https?\:\/\//i, '');
    return `http://imgproc.zooniverse.org/crop/${this.starChart.width}/${this.starChart.height}/${this.starChart.x}/${this.starChart.y}?u=${url}`;
  }

  computeRotation() {
    return (this.starChart.xAxis.unit === Axis.RA || this.starChart.xAxis.unit === Axis.RA1950 || this.starChart.xAxis.unit === Axis.GLON) ? 180 : 90;
  }

  getWwtUrl() {
    const base = 'http://www.worldwidetelescope.org/wwtweb/ShowImage.aspx';
    const rotation = this.computeRotation();
    const center = this.centerCoords();
    return `${base}?name=${'Zooniverse'}&ra=${center.ra}&dec=${center.dec}&x=${center.x}&y=${center.y}&scale=${this.scale()}&rotation=${rotation}&imageurl=${this.getCropUrl()}`;
  }
}

export default class WorldWideTelescope extends React.Component {
  parseClassification() {
    const telescopeAnnotations = [];
    this.props.annotations.map((annotation) => {
      if (this.props.workflow.tasks[annotation.task].type === 'drawing') {
        annotation.type = this.props.workflow.tasks[annotation.task].type;
        telescopeAnnotations.push(annotation);
      }
    });

    // parse chart rectangles
    this.charts = telescopeAnnotations[0].value.map(annotation =>
      new StarChart(annotation)
    );

    // assign axis points to charts
    telescopeAnnotations[1].value.forEach((annotation) => {
      const point = new AxisPoint(annotation);
      const distances = this.charts.map(chart =>
        chart.closestCornerDistance(point)
      );
      const closest = distances.sort((a, b) => { return a.distance > b.distance; })[0].chart;
      closest.addAxisPoint(point);
    });

    // assign axis labels to charts
    telescopeAnnotations[2].value.forEach((annotation) => {
      const label = new AxisLabel(annotation);
      const distances = this.charts.map(chart =>
        chart.closestMidpointDistance(label)
      );
      const closest = distances.sort((a, b) => { return a.distance > b.distance; })[0].chart;
      closest.addAxisLabel(label);
    });

    this.charts.forEach((chart) => {
      chart.buildAxes();
    });
  }

  render() {
    const subjImage = getSubjectLocation(this.props.subject).src;
    const plates = [];

    try {
      this.parseClassification();

      this.charts.forEach((chart) => {
        if (chart.valid) {
          plates.push(new Plate(chart, subjImage, this.props.subject));
        }
      });
    } catch (e) {
      return null;
    }

    return (
      <div className="worldwide-telescope">
        {!!plates.length && (<p>View Your Classification!</p>)}
        {plates.map((plate, idx) => {
          return (
            <div className="worldwide-telescope__container" key={idx}>
              <div>
                <img role="presentation" className="worldwide-telescope__chart-image" src={`${plate.getCropUrl()}`} />
              </div>
              <div className="worldwide-telescope__content">
                <a target="_blank" rel="noopener noreferrer" href={plate.getWwtUrl()} className="standard-button">World Wide Telescope</a>
                <p>If the image appears misaligned within World Wide Telescope, please click on Talk and label the subject with <a target="_blank" rel="noopener noreferrer" href={`https://zooniverse.org/projects/${this.props.project.slug}/talk/tags/misaligned`}>#misaligned</a>.</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

WorldWideTelescope.propTypes = {
  annotations: PropTypes.arrayOf(PropTypes.object),
  project: PropTypes.shape({
    slug: PropTypes.string
  }),
  subject: PropTypes.shape({
    locations: PropTypes.array,
    metadata: PropTypes.object
  }),
  workflow: PropTypes.shape({
    tasks: PropTypes.object
  })
};

WorldWideTelescope.defaultProps = {
  annotations: []
};
