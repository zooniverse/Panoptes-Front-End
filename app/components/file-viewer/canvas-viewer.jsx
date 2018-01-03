import React from 'react';
import LoadingIndicator from '../loading-indicator';

class CanvasViewer extends React.Component {
  constructor(props) {
    super(props);
    this.onLoad = this.onLoad.bind(this);
    this.state = {
      loading: true
    };
  }
  componentDidMount() {
    this.onLoad({ target: {}});
  }
  onLoad(e) {
    const loading = false;
    this.setState({ loading });
    this.props.onLoad(e);

    // u(t) is called 60 times per second.
    // t: Elapsed time in seconds.
    // S: Shorthand for Math.sin.
    // C: Shorthand for Math.cos.
    // T: Shorthand for Math.tan.
    // R: Function that generates rgba-strings, usage ex.: R(255, 255, 255, 0.5)
    // c: A 1920x1080 canvas.
    // x: A 2D context for that canvas.
    const x = this.canvas.getContext('2d');
    const t = 10;
    for (let i = 0; i < 9; i += 1) {
      x.fillStyle = 'green';
      x.fillRect(0, 0, 5, 5);
      x.fillStyle = 'orange';
      x.fillRect(400 + (i * 100) + (Math.sin(t) * 300), 100, 50, 200);
    } // 126/140
  }
  // TODO: choose size from subject metadata. Handle Pan and Zoom, actually
  //       render things...
  render() {
    return (
      <div className="subject-canvas-frame" >
        <canvas
          className="subject pan-active"
          width={512}
          height={512}
          ref={(r) => { this.canvas = r; }}
          style={Object.assign({ width: '100%' }, this.props.style)}
          tabIndex={0}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
        />
        {this.state.loading &&
          <div className="loading-cover" style={this.props.overlayStyle} >
            <LoadingIndicator />
          </div>}
      </div>
    );
  }
}

CanvasViewer.propTypes = {
  onBlur: React.PropTypes.func,
  onFocus: React.PropTypes.func,
  onLoad: React.PropTypes.func,
  overlayStyle: React.PropTypes.object,
  src: React.PropTypes.string,
  style: React.PropTypes.object
};

export default CanvasViewer;
