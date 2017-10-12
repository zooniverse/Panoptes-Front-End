import React from 'react';
import Translate from 'react-translate-component';

const WorkflowToggle = ({ workflow, handleToggle, name, checked }) => {
  return (
    <span>
      { workflow.id } - { workflow.display_name}:
      <label>
        <input
          type="checkbox"
          name={name}
          value={checked}
          checked={checked}
          onChange={handleToggle}
        />
        <Translate content="workflowToggle.label" />
      </label>
    </span>
  );
}

WorkflowToggle.defaultProps = {
  checked: null,
  handleToggle: () => {},
  name: null,
  workflow: {}
};

WorkflowToggle.propTypes = {
  checked: React.PropTypes.bool,
  handleToggle: React.PropTypes.func,
  name: React.PropTypes.string,
  workflow: React.PropTypes.object // eslint-disable-line react/forbid-prop-types
};

export default WorkflowToggle;
