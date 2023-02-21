import PropTypes from 'prop-types';
import React from 'react';
import { captureException } from '@sentry/browser';
import LoadingIndicator from '../loading-indicator';

class ImageViewer extends React.Component {
  constructor(props) {
    super(props);
    this.onLoad = this.onLoad.bind(this);
    this.onError = this.onError.bind(this);
    this.state = {
      loading: true
    };
  }

  onLoad(e) {
    const loading = false;
    this.setState({ loading });
    this.props.onLoad(e);
  }

  onError(error) {
    captureException(error);
  }

  render() {
    return (
      <div className="subject-image-frame" >
        <img className="subject pan-active" alt="" src={this.props.src} style={this.props.style} onLoad={this.onLoad} onError={this.onError} tabIndex={0} onFocus={this.props.onFocus} onBlur={this.props.onBlur} />

        {this.state.loading &&
          <div className="loading-cover" style={this.props.overlayStyle} >
            <LoadingIndicator />
          </div>}
      </div>
    );
  }
}

ImageViewer.propTypes = {
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onLoad: PropTypes.func,
  overlayStyle: PropTypes.object,
  src: PropTypes.string,
  style: PropTypes.object
};

export default ImageViewer;