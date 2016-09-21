import React from 'react';

const PanZoom = React.createClass({
  
  getDefaultProps() {
    return {
      enabled: false,
      frameDimensions: {
        height: 0,
        width: 0
      }
    }
  },
  
  getInitialState() {
    return {
      panEnabled: false,
      viewBoxDimensions: {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      },
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
  
  componentWillUpdate(newProps) {
    if (newProps.frameDimensions == this.props.frameDimensions) return;
    this.setState({
      viewBoxDimensions: {
        width: newProps.frameDimensions.width,
        height: newProps.frameDimensions.height,
        x: 0,
        y: 0
      }
    });
  },
  
  render() {
    const children = React.Children.map(this.props.children, (child) => {
          return React.cloneElement(child, {
            viewBoxDimensions: this.state.viewBoxDimensions,
            panByDrag: this.panByDrag,
            panEnabled: this.state.panEnabled
          })
        });
    return (
      <div>
      {children}
      {this.props.enabled ?
        <div className="pan-zoom-controls" >
          <div className="draw-pan-toggle" >
            <div className={this.state.panEnabled ? "" : "active"} >
              <button title="annotate" className="fa fa-mouse-pointer" onClick={this.togglePanOff}/>
            </div>
            <div className={this.state.panEnabled ? "active" : ""}>
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
        : ""
      }
      </div>
    )
  },
  
  handleFocus(ref) {
    this.refs[ref].focus();
    this.togglePanOn();
  },

  cannotZoomOut() {
    return this.props.frameDimensions.width == this.state.viewBoxDimensions.width && this.props.frameDimensions.height == this.state.viewBoxDimensions.height;
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
    let newNaturalWidth = this.state.viewBoxDimensions.width * change;
    let newNaturalHeight = this.state.viewBoxDimensions.height * change;

    let newNaturalX = this.state.viewBoxDimensions.x - (newNaturalWidth - this.state.viewBoxDimensions.width) / 2;
    let newNaturalY = this.state.viewBoxDimensions.y - (newNaturalHeight - this.state.viewBoxDimensions.height) / 2;

    if ((newNaturalWidth > this.props.frameDimensions.width) || (newNaturalHeight * change > this.props.frameDimensions.height)) {
      this.zoomReset()
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
  },

  keyDownZoomButton(change, e) {
    // only zoom if a user presses enter on the zoom button.
    if (e.which == 13) {
      this.setState({zooming: true}, () => {
        this.zoom(change);
      });
    }
  },

  stopZoom(e) {
    e.stopPropagation();
    this.setState({zooming: false});
    this.continuousZoom(0);
  },
  
  zoomReset() {
    this.setState({
      viewBoxDimensions: {
        width: this.props.frameDimensions.width,
        height: this.props.frameDimensions.height,
        x: 0,
        y: 0
      }
    });
  },

  togglePanOn() {
    if (!this.state.panEnabled) this.setState({panEnabled: true});
  },
  
  togglePanOff() {
    this.setState({panEnabled: false});
  },
  
  toggleKeyPanZoom() {
    this.setState({keyPanZoomEnabled: !this.state.keyPanZoomEnabled});
  },
  
  panByDrag(e, d) {
    if (!this.state.panEnabled) return;

    let maximumX = (this.props.frameDimensions.width - this.state.viewBoxDimensions.width) + (this.props.frameDimensions.width * 0.6);
    let minumumX = -(this.props.frameDimensions.width * 0.6);
    let changedX = this.state.viewBoxDimensions.x -= d.x;

    let maximumY = (this.props.frameDimensions.height - this.state.viewBoxDimensions.height) + (this.props.frameDimensions.height * 0.6);
    let minimumY = -(this.props.frameDimensions.height * 0.6);
    let changedY = this.state.viewBoxDimensions.y -= d.y;

    this.setState({
      viewBoxDimensions: {
        x: Math.max(minumumX, Math.min(changedX, maximumX)),
        y: Math.max(minimumY, Math.min(changedY, maximumY)),
        width: this.state.viewBoxDimensions.width,
        height: this.state.viewBoxDimensions.height
      }
    });
  },

  frameKeyPan(e) {
    if (!this.state.panEnabled) return;
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
    let maximumX = (this.props.frameDimensions.width - this.state.viewBoxDimensions.width) + (this.props.frameDimensions.width * 0.6);
    let minumumX = -(this.props.frameDimensions.width * 0.6);
    let changedX = this.state.viewBoxDimensions.x + direction;
    this.setState({
      viewBoxDimensions: {
        x: Math.max(minumumX, Math.min(changedX, maximumX)),
        y: this.state.viewBoxDimensions.y,
        width: this.state.viewBoxDimensions.width,
        height: this.state.viewBoxDimensions.height
      }
    });
  },

  panVertical(direction) {
    let maximumY = (this.props.frameDimensions.height - this.state.viewBoxDimensions.height) + (this.props.frameDimensions.height * 0.6);
    let minimumY = -(this.props.frameDimensions.height * 0.6);
    let changedY = this.state.viewBoxDimensions.y + direction;
    this.setState({
      viewBoxDimensions: {
        x: this.state.viewBoxDimensions.x,
        y: Math.max(minimumY, Math.min(changedY, maximumY)),
        width: this.state.viewBoxDimensions.width,
        height: this.state.viewBoxDimensions.height
      }
    });
  }
  
});

export default PanZoom;