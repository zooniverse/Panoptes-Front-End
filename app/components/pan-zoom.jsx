import React from 'react';

const PanZoom = React.createClass({
  
  getInitialState() {
    return {
      zooming: false,
      zoomingTimeoutId: null
    }
  },
  
  componentDidMount() {
    // these events enable a user to navigate an image using arrows, +, and - keys,
    // while the user is in pan and zoom mode.
    addEventListener("keydown", this.frameKeyPan);
    addEventListener("wheel", this.frameKeyPan);
  },

  componentWillUnmount() {
    removeEventListener("keydown", this.frameKeyPan);
    removeEventListener("wheel", this.frameKeyPan);
  },
  
  render() {
    return (
      <div className="pan-zoom-controls" >
        <div className="draw-pan-toggle" >
          <div className={this.props.panEnabled ? "" : "active"} >
            <button title="annotate" className="fa fa-mouse-pointer" onClick={this.togglePanOff}/>
          </div>
          <div className={this.props.panEnabled ? "active" : ""}>
            <button title="pan" ref="pan" className="fa fa-arrows" onClick={this.handleFocus.bind(this, "pan")} onFocus={this.togglePanOn} onBlur={this.togglePanOff}/>
          </div>
        </div>
        <div>
          <button
            title="zoom out"
            ref="zoomOut"
            className={"zoom-out fa fa-minus" + (this.cannotZoomOut() ? " disabled" : "") }
            onMouseDown={ this.continuousZoom.bind(this, 1.1 ) }
            onMouseUp={this.stopZoom}
            onKeyDown={this.keyDownZoomButton.bind(this,1.1)}
            onKeyUp={this.stopZoom}
            onFocus={this.togglePanOn}
            onBlur={this.togglePanOff}
            onClick={this.handleFocus.bind(this, "zoomOut")}
          />
        </div>
        <div>
          <button
            title="zoom in"
            ref="zoomIn"
            className="zoom-in fa fa-plus"
            onMouseDown={this.continuousZoom.bind(this, .9)}
            onMouseUp={this.stopZoom}
            onKeyDown={this.keyDownZoomButton.bind(this,.9)}
            onKeyUp={this.stopZoom}
            onFocus={this.togglePanOn}
            onBlur={this.togglePanOff}
            onClick={this.handleFocus.bind(this, "zoomIn")}
          />
        </div>
        <div>
          <button title="reset zoom levels" className={"reset fa fa-refresh" + (this.cannotZoomOut() ? " disabled" : "")} onClick={ this.zoomReset } ></button>
        </div>
      </div>
    )
  },
  
  handleFocus(ref) {
    this.refs[ref].focus();
    this.togglePanOn();
  },

  cannotZoomOut() {
    return this.props.frameDimensions.width == this.props.viewBoxDimensions.width && this.props.frameDimensions.height == this.props.viewBoxDimensions.height;
  },

  continuousZoom(change) {
    this.clearZoomingTimeout();
    if (change == 0) return;
    this.setState( {zooming: true}, () => {
      let zoomNow = () => {
        // if !this.state.zooming, we don't want to continuously call setTimeout.
        // !this.state.zooming will be the case after a user creates a mouseup event.
        if (!this.state.zooming) return;
        this.zoom(change);
        this.clearZoomingTimeout();
        this.setState( {zoomingTimeoutId: setTimeout(zoomNow, 200)} );
      }
      zoomNow();
    });
  },

  clearZoomingTimeout() {
    if (this.state.zoomingTimeoutId) {
      clearTimeout(this.state.zoomingTimeoutId);
    }
  },

  zoom(change) {
    this.clearZoomingTimeout();
    if (!this.state.zooming) return;
    let newNaturalWidth = this.props.viewBoxDimensions.width * change;
    let newNaturalHeight = this.props.viewBoxDimensions.height * change;

    let newNaturalX = this.props.viewBoxDimensions.x - (newNaturalWidth - this.props.viewBoxDimensions.width) / 2;
    let newNaturalY = this.props.viewBoxDimensions.y - (newNaturalHeight - this.props.viewBoxDimensions.height) / 2;

    if ((newNaturalWidth > this.props.frameDimensions.width) || (newNaturalHeight * change > this.props.frameDimensions.height)) {
      this.zoomReset()
    } else {
      this.props.onChange({
          width: newNaturalWidth,
          height: newNaturalHeight,
          x: newNaturalX,
          y: newNaturalY
      });
    }
  },

  keyDownZoomButton(change, e) {
    // only zoom if a user presses enter on the zoom button.
    if (e.which == 13) {
      this.setState({zooming: true}), () => {
        this.zoom(change);
      }
    }
  },

  stopZoom(e) {
    e.stopPropagation();
    this.setState({zooming: false});
    this.continuousZoom(0);
  },
  
  zoomReset() {
    this.props.onChange({
        width: this.props.frameDimensions.width,
        height: this.props.frameDimensions.height,
        x: 0,
        y: 0
    });
  },

  togglePanOn() {
    if (!this.props.panEnabled) this.props.onToggle(true);
  },
  
  togglePanOff() {
    this.props.onToggle(false);
  },
  
  toggleKeyPanZoom() {
    this.setState({keyPanZoomEnabled: !this.state.keyPanZoomEnabled});
  },
  
  panByDrag(e, d) {
    if (!this.props.panEnabled) return;

    let maximumX = (this.props.frameDimensions.width - this.props.viewBoxDimensions.width) + (this.props.frameDimensions.width * 0.6);
    let minumumX = -(this.props.frameDimensions.width * 0.6);
    let changedX = this.props.viewBoxDimensions.x -= d.x;

    let maximumY = (this.props.frameDimensions.height - this.props.viewBoxDimensions.height) + (this.props.frameDimensions.height * 0.6);
    let minimumY = -(this.props.frameDimensions.height * 0.6);
    let changedY = this.props.viewBoxDimensions.y -= d.y;

    this.props.onChange({
        x: Math.max(minumumX, Math.min(changedX, maximumX)),
        y: Math.max(minimumY, Math.min(changedY, maximumY)),
        width: this.props.viewBoxDimensions.width,
        height: this.props.viewBoxDimensions.height
    });
  },

  frameKeyPan(e) {
    if (!this.props.panEnabled) return;
    let keypress = e.which;
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
        this.setState({zooming: true});
        this.zoom(.9);
        break;
      // zoom in - Chrome(189), Firefox(173)
      case 189:
      case 173:
        e.preventDefault()
        this.setState({zooming: true});
        this.zoom(1.1);
        break;
      // zooming by wheel
      case 1:
        e.preventDefault();
        this.setState({zooming: true});
        (e.deltaY > 0) ? this.zoom(1.1) : this.zoom(0.9);
        break;
    }
  },

  panHorizontal(direction) {
    let maximumX = (this.props.frameDimensions.width - this.props.viewBoxDimensions.width) + (this.props.frameDimensions.width * 0.6);
    let minumumX = -(this.props.frameDimensions.width * 0.6);
    let changedX = this.props.viewBoxDimensions.x + direction;
    this.props.onChange({
        x: Math.max(minumumX, Math.min(changedX, maximumX)),
        y: this.props.viewBoxDimensions.y,
        width: this.props.viewBoxDimensions.width,
        height: this.props.viewBoxDimensions.height
    });
  },

  panVertical(direction) {
    let maximumY = (this.props.frameDimensions.height - this.props.viewBoxDimensions.height) + (this.props.frameDimensions.height * 0.6);
    let minimumY = -(this.props.frameDimensions.height * 0.6);
    let changedY = this.props.viewBoxDimensions.y + direction;
    this.props.onChange({
        x: this.props.viewBoxDimensions.x,
        y: Math.max(minimumY, Math.min(changedY, maximumY)),
        width: this.props.viewBoxDimensions.width,
        height: this.props.viewBoxDimensions.height
    });
  }
  
});

export default PanZoom;