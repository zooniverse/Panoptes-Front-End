import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

const WorkflowsTable = ({ handleWorkflowSettingChange, labPath, meta, project, workflows }) => {
  return (
    <table className="standard-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Progress</th>
        </tr>
      </thead>
      <tbody>
        {workflows.map((workflow) => {
          const progressPercentage = workflow.completeness * 100;
          return (
            <tr key={workflow.id}>
              <td>
                <Link key={workflow.id} to={labPath(`/workflows/${workflow.id}`)} activeClassName="active">
                  {workflow.display_name}
                  {(project.configuration && workflow.id === project.configuration.default_workflow) && (
                    <span title="Default workflow">{' '}*{' '}</span>
                  )}
                </Link>
              </td>
              <td>
                {`${progressPercentage.toFixed(0)} % Complete`}
              </td>
              <td>
                <label htmlFor="active">
                  <input
                    checked={workflow.active}
                    id="active"
                    onChange={e => handleWorkflowSettingChange(e, meta.page, workflow)}
                    type="checkbox"
                  />
                  Active
                </label>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default WorkflowsTable;
