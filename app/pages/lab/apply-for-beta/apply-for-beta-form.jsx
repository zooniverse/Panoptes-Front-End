import PropTypes from 'prop-types';
import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import config from './validation-config';
import ApplyButton from './components/apply-button';

// Component
class ApplyForBetaForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <ApplyButton />
      </div>
    );
  }
}

ApplyForBetaForm.defaultProps = {
};

ApplyForBetaForm.propTypes = {
};

export default ApplyForBetaForm;
