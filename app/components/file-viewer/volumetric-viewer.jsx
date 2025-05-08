import PropTypes from 'prop-types';
import React, { Suspense } from 'react';

class VolumetricViewer extends React.Component {
  constructor(props) {
    super(props);
    this.ViewerComponent = React.lazy(() => import('./VolumetricViewer/index.js'));
  }

  render() {
    const config = {
      subject: { locations: [{ type: 'application', url: this.props.src }] },
    };
    const ViewerComponent = this.ViewerComponent;

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <ViewerComponent {...config} />
      </Suspense>
    );
  }
}

VolumetricViewer.propTypes = {
  src: PropTypes.string,
};

export default VolumetricViewer;
