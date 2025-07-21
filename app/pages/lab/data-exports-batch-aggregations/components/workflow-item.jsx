import React from 'react';

const DEFAULT_FUNCTION = () => {};

export default function WorkflowItem ({
  checked = false,
  onChange = DEFAULT_FUNCTION,
  workflow
}) {
  if (!workflow) return null;

  return (
    <li>
      <input
        checked={checked}
        id={`workflows-list-${workflow.id}`}
        name="available-workflows"
        onChange={onChange}
        type="radio"
        value={workflow.id}
      />
      <label htmlFor={`workflows-list-${workflow.id}`}>
        {workflow.id} - {workflow.display_name}
      </label>
    </li>
  );
}