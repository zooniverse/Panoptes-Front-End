import React from 'react';
import crypto from 'crypto';

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
    this.RA = 0;
    this.RA1950 = 1;
    this.DEC = 2;
    this.DEC1950 = 3;
    this.GLAT = 4;
    this.GLON = 5;
  }
}

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

    let edges = [ [this.x, this.y], [this.x, this.y + this.height], [this.x + this.width, this.y], [this.x + this.width, this.y + this.height] ];
    this.corners = edges.forEach((pt) => {
      return new SimplePoint(pt[0], pt[1]);
    });
  }

  bounds() {
    return {
      x: [this.x, this.x + this.width],
      y: [this.y, this.y + this.height]
    };
  }

  calculateDistance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  }

  closestCornerDistance(p) {
    const distance = this.corners.forEach((corner) => {
      return this.calculateDistance(p, corner);
    });

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
            y: (p1.y + p2.y) / 2
          });
        }
      });
    });
  }

  closestMidpointDistance(p) {
    if (!this.midpoints) {
      this.calculateMidpoints();
    }
    const distances = this.midpoint.forEach((midpoint) => {
      return this.calculateDistance(p, midpoint);
    });
    return {
      chart: this,
      distance: Math.min.apply(null, distances)
    };
  }

  addAxisPoint(axisPoint) {
    this.axisPoints.push(axisPoint);
  }

  addAxisLabel(axisLabel) {
    this.axisLabels.push(axisLabel);
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
    const midpoint = {x: (range[0].x + range[1].x) / 2, y: (range[1].y + range[1].y) / 2};
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
      xRange = (this.findAxis, this.axisPoints).xAxis.sort( (a, b) => {a.x > b.x} );
      yRange = (this.findAxis, this.axisPoints).yAxis.sort( (a, b) => {a.y > b.y} );
      xLabel = this.findLabels(xRange, this.axisLabels);
      yLabel = this.findLabels(yRange, this.axisLabels);
      this.xAxis = new Axis(xRange, xLabel.value);
      this.yAxis = new Axis(yRange, yLabel.value);
    }
  }

  coordinateSystem() {
    let coords = StarChart.OTHER;
    if ((this.xAxis.unit == Axis.RA && this.yAxis.unit == Axis.DEC) || (this.xAxis.unit == Axis.DEC && this.yAxis.unit == Axis.RA)) {
      coords = StarChart.EQUATORIAL;
    }
    if ((this.xAxis.unit == Axis.RA1950 && this.yAxis.unit == Axis.DEC1950) || (this.xAxis.unit == Axis.DEC1950 && this.yAxis.unit == Axis.RA1950)) {
      coords = StarChart.EQUATORIAL;
    }
    if ((this.xAxis.unit == Axis.GLAT && this.yAxis.unit == Axis.GLON) || (this.xAxis.unit == Axis.GLON && this.yAxis.unit == Axis.GLAT)) {
      coords = StarChart.GALACTIC;
    }
    return coords;
  }
}

class Plate {
  constructor(starChart, url) {
    let makeStarCoord;
    this.starChart = starChart;
    this.url = url;
    this.imageBounds = this.starChart.bounds();
    let [xRange, yRange] = [this.starChart.xAxis.range, this.starChart.yAxis.range];

    this.xyCorners = [
      new SimplePoint(xRange[0].x, yRange[0].y), new SimplePoint(xRange[1].x, yRange[0].y),
      new SimplePoint(xRange[1].x, yRange[1].y), new SimplePoint(xRange[0].x, yRange[1].y)
    ];

    if (this.starChart.coordinateSystem() == StarChart.EQUATORIAL) {
     makeStarCoord = StarCoord.fromRaDec;
    } else {
     makeStarCoord = StarCoord.fromGlatGlon;
    }
    const xAxisDec = (this.starChart.xAxis.unit == Axis.DEC || this.starChart.xAxis.unit == Axis.DEC1950 || this.starChart.xAxis.unit == Axis.GLAT) ? true : false;
    const epoch1950 = (this.starChart.xAxis.unit == Axis.DEC1950 || this.starChart.xAxis.unit == Axis.RA1950) ? true : false;
    this.fullValues(xRange);
    this.fullValues(yRange);
    this.coordCorners = [
      makeStarCoord(xRange[0].value, yRange[0].value, xAxisDec, epoch1950), makeStarCoord(xRange[1].value, yRange[0].value, xAxisDec, epoch1950),
      makeStarCoord(xRange[1].value, yRange[1].value, xAxisDec, epoch1950), makeStarCoord(xRange[0].value, yRange[1].value, xAxisDec, epoch1950)
    ];
  }

  fullValues(ranges) {
    let difference;
    let secondValue;
    const firstValue = ranges[0].value.match(/(-)?\d+(?:\.\d+)?/g);
    if (!!ranges[1].value) {
      secondValue = ranges[1].value.match(/(-)?\d+(?:\.\d+)?/g);
    }
    if (!!secondValue.length) {
      difference = Math.abs(firstValue.length - secondValue.length);
    }
    if (difference > 0 && secondValue) {
      let longerNumber = (firstValue.length > secondValue.length) ? firstValue : secondValue;
      let shorterNumber = (secondValue.length < firstValue.length) ? secondValue : firstValue;
      index = 0;
      do {
        shorterNumber.splice(index, 0, longerNumber[index]);
        index = index + 1;
      } while (longerNumber.length !== shorterNumber.length);
      return [ranges[0].value, ranges[1].value] = [firstValue.join(" "), secondValue.join(" ")];
    }
  }

  scale() {
    const [star1, star2] = [ this.coordCorners[0], this.coordCorners[2] ];
    const [xy1, xy2] = [ this.xyCorners[0], this.xyCorners[2] ];
    const averageDec = (star1.dec + star2.dec) / 2;
    const deltaRA = ((star2.ra - star1.ra) * Math.cos(averageDec * Math.PI/180)) * 3600;
    const deltaDec = (star2.dec - star1.dec) * 3600;
    const angularSep = Math.sqrt(Math.pow(deltaRA, 2) + Math.pow(deltaDec, 2));
    const pixelSep = Math.sqrt(Math.pow(xy1.x - xy2.x, 2) + Math.pow(xy1.y - xy2.y, 2));
    return angularSep / pixelSep;
  }

  centerCoords() {
    s = this.starChart;
    const upperY = s.height - (s.yAxis.range[0].y - s.corners[0].y)
    const lowerY = s.corners[3].y - s.yAxis.range[1].y
    return {
      x: ((s.xAxis.range[0].x - s.corners[0].x) + (s.xAxis.range[1].x - s.corners[0].x)) / 2,
      y: (upperY + lowerY) / 2,
      ra: (this.coordCorners[0].ra + this.coordCorners[2].ra) / 2,
      dec: (this.coordCorners[0].dec + this.coordCorners[2].dec) / 2
    };
  }

  getCropUrl() {
    url = this.url.replace(/^https?\:\/\//i, "");
    // TODO: we need to account for the fact that the size of the image might be different than
    // the size that it is displayed
    return `http://imgproc.zooniverse.org/crop/${this.starChart.width}/${this.starChart.height}/${this.starChart.x}/${this.starChart.y}?u=${url}`
  }

  computeRotation() {
    return (this.starChart.xAxis.unit == Axis.RA || this.starChart.xAxis.unit == Axis.RA1950 || this.starChart.xAxis.unit == Axis.GLON) ? 180 : 90;
  }

  computeName() {
    return crypto.createHash('md5').update(new Date().toString()).digest('hex').slice(0, 10);
  }

  getWwtUrl() {
    const base = "http://www.worldwidetelescope.org/wwtweb/ShowImage.aspx";
    const rotation = this.computeRotation();
    const name = this.computeName();
    const center = this.centerCoords();
    return `${base}?name=${name}&ra=${center.ra}&dec=${center.dec}&x=${center.x}&y=${center.y}&scale=${this.scale()}&rotation=${rotation}&imageurl=${this.getCropUrl()}`
  }
}

class StarCoord {
  constructor(ra, dec){
    this.ra = ra;
    this.dec = dec;
    this.s = StarCoord;
    this.fromRaDec = this.fromRaDec.bind(this);
    this.fromGlatGlon = this.fromGlatGlon.bind(this);
    this._epochConvert = this._epochConvert.bind(this);
    this._toRadians = this._toRadians.bind(this);
    this._toDegrees = this._toDegrees.bind(this);
    this._parseDegrees = this._parseDegrees.bind(this);
    this._raConvert = this._raConvert.bind(this);
    this._decConvert = this._decConvert.bind(this);
  }

  fromRaDec(xAxis, yAxis, xAxisDec, epoch1950) {
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
  }

  fromGlatGlon(xAxis, yAxis, xAxisGlat, epoch1950) {
    let glat;
    let glon;
    if (xAxisGlat === true) {
      glat = xAxis;
      glon = yAxis;
    } else {
      glon = xAxis;
      glat = yAxis;
      glat = glat.replace(/[^\d.-]/g,'');
      glon = glon.replace(/[^\d.-]/g,'');
    }
    const [b, l, pole_ra, pole_dec, posangle] = [ s._toRadians(glat), s._toRadians(glon), s._toRadians(192.859508), s._toRadians(27.128336), s._toRadians(122.932-90.0) ];
    const ra = this.s._toDegrees(Math.atan2((Math.cos(b) * Math.cos(l - posangle)), (Math.sin(b) * Math.cos(pole_dec) - Math.cos(b) * Math.sin(pole_dec) * Math.sin(l-posangle))) + pole_ra)
    const dec = this.s._toDegrees(Math.asin(Math.cos(b) * Math.cos(pole_dec) * Math.sin(l - posangle) + Math.sin(b) * Math.sin(pole_dec)))
    return new StarCoord(ra, dec);
  }

  _epochConvert(ra, dec) {
    const RA2000 = ra + 0.640265 + 0.278369 * Math.sin(this._toDegrees(ra)) * Math.tan(this._toDegrees(dec));
    const DEC2000 = dec + 0.278369 * Math.cos(this._toDegrees(ra));
    return [RA2000, DEC2000];
  }

  _toRadians(degrees) {
    return (degrees * Math.PI) / 180.0;
  }

  _toDegrees(radians) {
    return (radians * 180.0) / Math.PI;
  }

  _parseDegrees(str, dec) {
    if (isNaN(str)) return parseFloat(str);

    let isNeg = false;
    const reg = `///
      (?:
      (-)?                  // leading minus sign, if present
      (\d+(?:\.\d+)?))      // a number that may or may not have decimal digits
      (?:
      \D+                   // one or more non-numeric digits (not captured)
      (\d+(?:\.\d+)?))      // a number that may or may not have decimal digits
      ?                     // this term is optional
      (?:
      \D+                   // one or more non-numeric digits (not captured)
      (\d+(?:\.\d+)?))      // a number that may or may not have decimal digits
      ?                     // this term is optional
      ///`
    const match = reg.exec(str);
    isNeg = match[1] == '-';
    match.shift();
    if (dec === true) {
      return this.s._decConvert(match, isNeg);
    } else {
      return this.s._raConvert(match, isNeg);
    }
  }

  _raConvert(match, isNeg) {
    const multiplier = isNeg ? -1 : 1;

    return (parseInt(match[1], 10) * 15 +
    (parseInt(match[2], 10) / 4 || 0) +
    (parseInt(match[3]) / 240 || 0)) *
    multiplier
  }

  _decConvert(match, isNeg) {
    const multiplier = isNeg ? -1 : 1;

    return (parseInt(match[1], 10) +
    (parseInt(match[2], 10) / 60 || 0) +
    (parseInt(match[3]) / 3600 || 0)) *
    multiplier;
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
    this.charts = telescopeAnnotations[0].value.forEach((annotation) => {
      return new StarChart(annotation);
    });

    // assign axis points to charts
    telescopeAnnotations[1].value.forEach((annotation) => {
      const point = new AxisPoint(annotation);
      const distances = this.charts.forEach((chart) => {
        return chart.closestCornerDistance(point);
      });
      let closest = distances.sort((a, b) => a.distance > b.distance)[0].chart
      closest.addAxisPoint(point);
    });

    // assign axis labels to charts
    telescopeAnnotations[2].value.forEach((annotation) => {
      const label = new AxisLabel(annotation);
      const distances = this.charts.forEach((chart) => {
        return chart.closestMidpointDistance(label);
      });
      const closest = distances.sort((a, b) => a.distance > b.distance)[0].chart
      closest.addAxisLabel(label);
    });

    this.charts.forEach((chart) => {
      chart.buildAxes();
    });
  }

  render() {
    const subjImage = this.props.subject.locations[0]["image/jpeg"];
    const plates = [];

    try {
      this.parseClassification();
    } catch (e) {
      console.warn(e);
    }

    this.charts.forEach((chart) => {
      if (chart.valid) {
        plates.push(new Plate(chart, subjImage));
      }
    });

    return (
      <div>
        {plates.map((plate, idx) => {
          return (
            <div key={idx}>
              <p>View Your Classification in the WorldWide Telescope!</p>
              <img role="presentation" className="chart-image" src={`${plate.getCropUrl()}`} />
              <a target="_blank" rel="noopener noreferrer" href={plate.getWwtUrl()} className="telescope-button standard-button">World Wide Telescope</a>
            </div>
          );
        })}
      </div>
    );
  }

}
