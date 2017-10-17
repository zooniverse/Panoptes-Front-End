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
  checked: React.PropTypes.bool,
  handleToggle: React.PropTypes.func,
  name: React.PropTypes.string,
  workflow: React.PropTypes.shape({
    display_name: React.PropTypes.string,
    id: React.PropTypes.string
  }).isRequired
};

export default WorkflowToggle;
