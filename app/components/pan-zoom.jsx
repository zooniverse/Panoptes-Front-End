/* eslint no-unused-expressions: ["error", { "allowTernary": true }] */
import PropTypes from 'prop-types';

import React from 'react';

class PanZoom extends React.Component {
  constructor() {
    super();
    this.frameKeyPan = this.frameKeyPan.bind(this);
    this.panByDrag = this.panByDrag.bind(this);
    this.rotateClockwise = this.rotateClockwise.bind(this);
    this.stopZoom = this.stopZoom.bind(this);
    this.togglePanOn = this.togglePanOn.bind(this);
    this.togglePanOff = this.togglePanOff.bind(this);
    this.wheelZoom = this.wheelZoom.bind(this);
    this.onReset = this.onReset.bind(this);
    this.state = {
      panEnabled: false,
      viewBoxDimensions: {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      },
      zooming: false,
      zoomingTimeoutId: null,
      rotation: 0,
      transform: ''
    };
  }


  componentDidMount() {
    // these events enable a user to navigate an image using arrows, +, and - keys,
    // while the user is in pan and zoom mode.
    if (this.root && this.props.enabled) {
      this.root.addEventListener('keydown', this.frameKeyPan);
      this.root.addEventListener('wheel', this.wheelZoom);
    }
    this.zoomReset();
  }

  componentWillUpdate(newProps) {
    const newSubject = newProps.subject !== this.props.subject;
    const widthChanged = newProps.frameDimensions.width !== this.props.frameDimensions.width;
    const heightChanged = newProps.frameDimensions.height !== this.props.frameDimensions.height;
    if (newSubject || widthChanged || heightChanged) {
      this.zoomReset(newProps);
    }
  }

  componentWillUnmount() {
    this.root.removeEventListener('keydown', this.frameKeyPan);
    this.root.removeEventListener('wheel', this.wheelZoom);
  }

  handleFocus(ref) {
    this[ref].focus();
    this.togglePanOn();
  }

  cannotZoomOut() {
    return this.props.frameDimensions.width === this.state.viewBoxDimensions.width &&
    this.props.frameDimensions.height === this.state.viewBoxDimensions.height;
  }

  cannotResetZoomRotate() {
    return this.cannotZoomOut() && this.state.rotation === 0;
  }

  continuousZoom(change) {
    this.clearZoomingTimeout();
    if (change === 0) return;
    this.setState({ zooming: true }, () => {
      const zoomNow = () => {
        // if !this.state.zooming, we don't want to continuously call setTimeout.
        // !this.state.zooming will be the case after a user creates a mouseup event.
        if (!this.state.zooming) return;
        this.zoom(change);
        this.clearZoomingTimeout();
        this.setState({ zoomingTimeoutId: setTimeout(zoomNow, 200) });
      };
      zoomNow();
    });
  }

  clearZoomingTimeout() {
    if (this.state.zoomingTimeoutId) {
      clearTimeout(this.state.zoomingTimeoutId);
    }
  }

  zoom(change) {
    this.clearZoomingTimeout();
    if (!this.state.zooming) return;
    const newNaturalWidth = this.state.viewBoxDimensions.width * change;
    const newNaturalHeight = this.state.viewBoxDimensions.height * change;

    const newNaturalX = this.state.viewBoxDimensions.x - ((newNaturalWidth - this.state.viewBoxDimensions.width) / 2);
    const newNaturalY = this.state.viewBoxDimensions.y - ((newNaturalHeight - this.state.viewBoxDimensions.height) / 2);

    if ((newNaturalWidth > this.props.frameDimensions.width) ||
    (newNaturalHeight * change > this.props.frameDimensions.height)) {
      this.zoomReset();
    } else {
      this.setState({
        viewBoxDimensions: {
          width: newNaturalWidth,
          height: newNaturalHeight,
          x: newNaturalX,
          y: newNaturalY
        }
      });
    }
  }

  keyDownZoomButton(change, e) {
    // only zoom if a user presses enter on the zoom button.
    if (e.which === 13) {
      this.setState({ zooming: true }, () => {
        this.zoom(change);
      });
    }
  }

  stopZoom(e) {
    e.stopPropagation();
    this.setState({ zooming: false });
    this.continuousZoom(0);
  }

  onReset() {
    this.zoomReset();
  }

  zoomReset(props) {
    props = props || this.props;
    this.setState({
      viewBoxDimensions: {
        width: props.frameDimensions.width,
        height: props.frameDimensions.height,
        x: 0,
        y: 0
      },
      rotation: 0,
      transform: `rotate(${0} ${props.frameDimensions.width / 2} ${props.frameDimensions.height / 2})`
    });
  }

  togglePanOn() {
    if (!this.state.panEnabled) this.setState({ panEnabled: true });
  }

  togglePanOff() {
    this.setState({ panEnabled: false });
  }

  toggleKeyPanZoom() {
    this.setState({ keyPanZoomEnabled: !this.state.keyPanZoomEnabled });
  }

  panByDrag(e, d) {
    if (!this.state.panEnabled) return;

    const maximumX = (this.props.frameDimensions.width - this.state.viewBoxDimensions.width) +
    (this.props.frameDimensions.width * 0.6);
    const minumumX = -(this.props.frameDimensions.width * 0.6);
    const changedX = this.state.viewBoxDimensions.x - d.x;

    const maximumY = (this.props.frameDimensions.height - this.state.viewBoxDimensions.height) +
    (this.props.frameDimensions.height * 0.6);
    const minimumY = -(this.props.frameDimensions.height * 0.6);
    const changedY = this.state.viewBoxDimensions.y - d.y;

    this.setState({
      viewBoxDimensions: {
        x: Math.max(minumumX, Math.min(changedX, maximumX)),
        y: Math.max(minimumY, Math.min(changedY, maximumY)),
        width: this.state.viewBoxDimensions.width,
        height: this.state.viewBoxDimensions.height
      }
    });
  }

  frameKeyPan(e) {
    const keypress = e.which;
    switch (keypress) {
      // left
      case 37:
        e.preventDefault();
        this.panHorizontal(-20);
        break;
      // up
      case 38:
        e.preventDefault();
        this.panVertical(-20);
        break;
      // right
      case 39:
        e.preventDefault();
        this.panHorizontal(20);
        break;
      // down
      case 40:
        e.preventDefault();
        this.panVertical(20);
        break;
      // zoom out - Chrome(187), Firefox(61)
      case 187:
      case 61:
        e.preventDefault();
        this.setState({ zooming: true });
        this.zoom(0.9);
        break;
      // zoom in - Chrome(189), Firefox(173)
      case 189:
      case 173:
        e.preventDefault();
        this.setState({ zooming: true });
        this.zoom(1.1);
        break;
      // no default
    }
  }

  wheelZoom(e) {
    if (!this.state.panEnabled) return;
    e.preventDefault();
    this.setState({ zooming: true });
    (e.deltaY > 0) ? this.zoom(1.1) : this.zoom(0.9);
  }

  panHorizontal(direction) {
    const maximumX = (this.props.frameDimensions.width - this.state.viewBoxDimensions.width) +
    (this.props.frameDimensions.width * 0.6);
    const minumumX = -(this.props.frameDimensions.width * 0.6);
    const changedX = this.state.viewBoxDimensions.x + direction;
    this.setState({
      viewBoxDimensions: {
        x: Math.max(minumumX, Math.min(changedX, maximumX)),
        y: this.state.viewBoxDimensions.y,
        width: this.state.viewBoxDimensions.width,
        height: this.state.viewBoxDimensions.height
      }
    });
  }

  panVertical(direction) {
    const maximumY = (this.props.frameDimensions.height - this.state.viewBoxDimensions.height) +
    (this.props.frameDimensions.height * 0.6);
    const minimumY = -(this.props.frameDimensions.height * 0.6);
    const changedY = this.state.viewBoxDimensions.y + direction;
    this.setState({
      viewBoxDimensions: {
        x: this.state.viewBoxDimensions.x,
        y: Math.max(minimumY, Math.min(changedY, maximumY)),
        width: this.state.viewBoxDimensions.width,
        height: this.state.viewBoxDimensions.height
      }
    });
  }

  rotateClockwise() {
    const newRotation = this.state.rotation + 90;
    this.setState({
      rotation: newRotation,
      transform: `rotate(${newRotation} ${this.props.frameDimensions.width / 2} ${this.props.frameDimensions.height / 2})`
    });
  }

  render() {
    const children = React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        viewBoxDimensions: this.state.viewBoxDimensions,
        panByDrag: this.panByDrag,
        panEnabled: this.state.panEnabled,
        transform: this.state.transform,
        rotation: this.state.rotation
      })
    );
    return (
      <div ref={(element) => { this.root = element; }}>
        {children}
        {this.props.enabled ?
          <div className="pan-zoom-controls" >
            <div className="draw-pan-toggle" >
              <div className={this.state.panEnabled ? '' : 'active'} >
                <button title="annotate" className="fa fa-mouse-pointer" onClick={this.togglePanOff} />
              </div>
              <div className={this.state.panEnabled ? 'active' : ''}>
                <button
                  title="pan"
                  ref={(element) => { this.pan = element; }}
                  className="fa fa-arrows"
                  onClick={this.handleFocus.bind(this, 'pan')}
                  onFocus={this.togglePanOn}
                  onBlur={this.togglePanOff}
                />
              </div>
            </div>
            <div>
              <button
                title="zoom out"
                ref={(element) => { this.zoomOut = element; }}
                className={`zoom-out fa fa-minus ${this.cannotZoomOut() ? 'disabled' : ''}`}
                onMouseDown={this.continuousZoom.bind(this, 1.1)}
                onMouseUp={this.stopZoom}
                onMouseOut={this.stopZoom}
                onKeyDown={this.keyDownZoomButton.bind(this, 1.1)}
                onKeyUp={this.stopZoom}
                onFocus={this.togglePanOn}
                onBlur={this.togglePanOff}
                onClick={this.handleFocus.bind(this, 'zoomOut')}
              />
            </div>
            <div>
              <button
                title="zoom in"
                ref={(element) => { this.zoomIn = element; }}
                className="zoom-in fa fa-plus"
                onMouseDown={this.continuousZoom.bind(this, 0.9)}
                onMouseUp={this.stopZoom}
                onMouseOut={this.stopZoom}
                onKeyDown={this.keyDownZoomButton.bind(this, 0.9)}
                onKeyUp={this.stopZoom}
                onFocus={this.togglePanOn}
                onBlur={this.togglePanOff}
                onClick={this.handleFocus.bind(this, 'zoomIn')}
              />
            </div>
            <div>
              <button title="rotate" className={'rotate fa fa-repeat'} onClick={this.rotateClockwise} />
            </div>
            <div>
              <button
                title="reset zoom levels"
                className={`reset fa fa-refresh ${this.cannotResetZoomRotate() ? ' disabled' : ''}`}
                onClick={this.onReset}
              />
            </div>
          </div>
          : ''
        }
      </div>
    );
  }
}

PanZoom.propTypes = {
  children: PropTypes.node,
  enabled: PropTypes.bool,
  frameDimensions: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number
  }),
  subject: PropTypes.shape({
    id: PropTypes.string
  })
};

PanZoom.defaultProps = {
  children: null,
  enabled: false,
  frameDimensions: {
    height: 0,
    width: 0
  },
  subject: {
    id: ''
  }
};

export default PanZoom;
