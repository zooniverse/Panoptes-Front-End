import React from 'react';
import LoadingIndicator from '../components/loading-indicator';

class ImageViewer extends React.Component {
  constructor(props) {
    super(props);
    this.onLoad = this.onLoad.bind(this);
    this.state = {
      loading: true
    };
  }

  onLoad(e) {
    const loading = false;
    this.setState({ loading });
    this.props.onLoad(e);
  }

  render() {
    return (
      <div className="subject-image-frame" >
        <img className="subject pan-active" alt="" src={this.props.src} style={this.props.style} onLoad={this.onLoad} tabIndex={0} onFocus={this.props.onFocus} onBlur={this.props.onBlur} />

        {this.state.loading &&
          <div className="loading-cover" style={this.props.overlayStyle} >
            <LoadingIndicator />
          </div>}
      </div>
    );
  }
}

ImageViewer.propTypes = {
  onBlur: React.PropTypes.func,
  onFocus: React.PropTypes.func,
  onLoad: React.PropTypes.func,
  overlayStyle: React.PropTypes.object,
  src: React.PropTypes.string,
  style: React.PropTypes.object
};

export default ImageViewer;
