import PropTypes from 'prop-types';
import React from 'react';
import Translate from 'react-translate-component';

const WorkflowToggle = ({ workflow, handleToggle, name, checked }) => (
  <span>
    { workflow.id } - { workflow.display_name}:
      <label>
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={handleToggle}
        />
        <Translate content="workflowToggle.label" />
      </label>
  </span>
  );

WorkflowToggle.defaultProps = {
  checked: false,
  handleToggle: () => {},
  name: '',
  workflow: {}
};

WorkflowToggle.propTypes = {
  checked: PropTypes.bool,
  handleToggle: PropTypes.func,
  name: PropTypes.string,
  workflow: PropTypes.shape({
    display_name: PropTypes.string,
    id: PropTypes.string
  }).isRequired
};

export default WorkflowToggle;