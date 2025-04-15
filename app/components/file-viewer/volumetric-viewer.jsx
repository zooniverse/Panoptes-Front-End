import PropTypes from 'prop-types';
import React, { Suspense } from 'react';

const VolumetricViewerComponent = React.lazy(() => import('./VolumetricViewer/index.js'))

class VolumetricViewer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const config = {
      subject: { locations: [{ type: 'application', url:  this.props.src }] },
    };

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <VolumetricViewerComponent {...config} />
      </Suspense>
    );
  }
}

VolumetricViewer.propTypes = {
  src: PropTypes.string,
};

export default VolumetricViewer;
